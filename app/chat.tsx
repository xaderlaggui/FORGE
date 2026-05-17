import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { Bot, Send, User as UserIcon, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ForgeTheme } from '../constants/ForgeTheme';
import { db } from '../services/firebase';
import { useAuthStore } from '../stores/authStore';


const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

const logActivityDeclaration: any = {
  name: "log_activity",
  description: "Log a user's fitness activity like walking, running, cycling, or lifting weights to their database.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      activityName: {
        type: SchemaType.STRING,
        description: "The name of the activity, e.g. 'Walking', 'Running', 'Weightlifting'",
      },
      durationMinutes: {
        type: SchemaType.INTEGER,
        description: "Estimated duration of the activity in minutes. Make an educated guess if the user provides distance instead of time (e.g. 15km walk is roughly 150 mins).",
      },
      notes: {
        type: SchemaType.STRING,
        description: "Any extra notes about the activity, like distance, intensity, etc. (e.g. '15km').",
      }
    },
    required: ["activityName", "durationMinutes"],
  },
};

type Message = { id: string; text: string; isAi: boolean };

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hey! I'm your AI Coach. Tell me what you did today (e.g. 'I walked 15km') and I'll log it for you!", isAi: true }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const chatSessionRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Initialize Gemini Chat Session with Tools
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ functionDeclarations: [logActivityDeclaration as any] }],
      systemInstruction: "You are an energetic, supportive fitness coach. If the user tells you about an exercise or activity they did, ALWAYS call the log_activity function to save it for them. Keep your responses short, punchy, and encouraging."
    });
    chatSessionRef.current = model.startChat({ history: [] });
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { id: Date.now().toString(), text: userMsg, isAi: false }]);
    setIsTyping(true);

    try {
      const result = await chatSessionRef.current.sendMessage(userMsg);
      const response = result.response;

      const functionCalls = response.functionCalls();

      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];

        if (call.name === "log_activity") {
          const { activityName, durationMinutes, notes } = call.args as any;

          // Execute the function: Save to Firestore
          const workoutRef = collection(db, `users/${user?.uid}/workouts`);
          await addDoc(workoutRef, {
            date: dayjs().format('YYYY-MM-DD'),
            title: activityName.toUpperCase(),
            notes: notes || `Duration: ${durationMinutes} mins`,
            exercises: [],
            createdAt: new Date().toISOString()
          });

          // Inform Gemini that the tool succeeded
          const functionResponseResult = await chatSessionRef.current.sendMessage([{
            functionResponse: {
              name: "log_activity",
              response: { success: true, message: `Successfully logged ${activityName} for ${durationMinutes} minutes.` }
            }
          }]);

          setMessages(prev => [...prev, { id: Date.now().toString(), text: functionResponseResult.response.text(), isAi: true }]);
        }
      } else {
        // Standard text response
        setMessages(prev => [...prev, { id: Date.now().toString(), text: response.text(), isAi: true }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), text: "Whoops, I had a little trouble connecting. Can you try again?", isAi: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.msgContainer, item.isAi ? styles.msgAi : styles.msgUser]}>
      {item.isAi && <View style={styles.iconBg}><Bot size={16} color="#000" /></View>}
      <View style={[styles.bubble, item.isAi ? styles.bubbleAi : styles.bubbleUser]}>
        {item.text.split(/(\*.*?\*|`.*?`)/g).map((chunk: string, i: number) => {
          if (chunk.startsWith('*') && chunk.endsWith('*')) {
            return <Text key={i} style={[styles.msgText, item.isAi ? styles.msgTextAi : styles.msgTextUser, { fontWeight: '900' }]}>{chunk.slice(1, -1)}</Text>;
          }
          return <Text key={i} style={[styles.msgText, item.isAi ? styles.msgTextAi : styles.msgTextUser]}>{chunk}</Text>;
        })}
      </View>
      {!item.isAi && <View style={[styles.iconBg, { backgroundColor: '#242429' }]}><UserIcon size={16} color="#FFF" /></View>}
    </View>
  );


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Bot size={20} color={ForgeTheme.colors.forge} />
          <Text style={styles.headerTitle}>AI Coach</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color={ForgeTheme.colors.t2} />
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={ForgeTheme.colors.forge} />
          <Text style={styles.typingText}>Coach is typing...</Text>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Message AI Coach..."
          placeholderTextColor={ForgeTheme.colors.t3}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={!inputText.trim() || isTyping}>
          <Send size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ForgeTheme.colors.bg0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60, borderBottomWidth: 0.5, borderBottomColor: ForgeTheme.colors.b1, backgroundColor: ForgeTheme.colors.bg1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: ForgeTheme.colors.t1, letterSpacing: 0.5 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: ForgeTheme.colors.bg2, alignItems: 'center', justifyContent: 'center' },

  chatList: { padding: 20, paddingBottom: 40, gap: 18 },

  msgContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, width: '100%', marginBottom: 16 },
  msgAi: { justifyContent: 'flex-start' },
  msgUser: { justifyContent: 'flex-end' },

  iconBg: { width: 30, height: 30, borderRadius: 15, backgroundColor: ForgeTheme.colors.bg2, justifyContent: 'center', alignItems: 'center', marginTop: 2 },

  bubble: { maxWidth: '80%', padding: 12, paddingHorizontal: 14, borderRadius: 16 },
  bubbleAi: { backgroundColor: ForgeTheme.colors.bg2, borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: ForgeTheme.colors.forge, borderBottomRightRadius: 4 },

  msgText: { fontSize: 14, lineHeight: 21, fontWeight: '400' },
  msgTextAi: { color: ForgeTheme.colors.t1 },
  msgTextUser: { color: '#FFF' },

  typingIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingBottom: 16 },
  typingText: { color: ForgeTheme.colors.t2, fontSize: 12, fontWeight: '600' },

  inputArea: { flexDirection: 'row', padding: 16, paddingBottom: 32, backgroundColor: ForgeTheme.colors.bg1, borderTopWidth: 0.5, borderTopColor: ForgeTheme.colors.b1, alignItems: 'center', gap: 10 },
  input: { flex: 1, backgroundColor: ForgeTheme.colors.bg2, borderRadius: 22, height: 44, paddingHorizontal: 16, color: ForgeTheme.colors.t1, fontSize: 14 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: ForgeTheme.colors.forge, justifyContent: 'center', alignItems: 'center' }
});
