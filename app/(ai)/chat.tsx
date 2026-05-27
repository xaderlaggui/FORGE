import React from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Send } from 'lucide-react-native';
import { useForgeTheme } from "@/hooks/useForgeTheme";
import { ChatMessage } from '../../features/ai/components/Chat/ChatMessage';
import { ChatTypingIndicator } from '../../features/ai/components/Chat/ChatTypingIndicator';
import { useChat, Message } from '../../features/ai/hooks/useChat';

export default function ChatScreen() {
  const { T } = useForgeTheme();
  const s = useS(T);
  
  const {
    user,
    inputText, setInputText,
    messages,
    isTyping,
    flatListRef,
    animatedIds,
    handleSend
  } = useChat();

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatMessage item={item} s={s} T={T} user={user} animatedIds={animatedIds} />
  );

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Header ── */}
      <View style={s.header}>
        <View style={[s.headerLeft, { flex: 1, justifyContent: 'center' }]}>
          <View style={{ alignItems: 'center' }}>
            <Text style={s.headerTitle} maxFontSizeMultiplier={1.2}>FORGE Coach</Text>
            <View style={s.onlineDot}>
              <View style={s.onlineDotCircle} />
              <Text style={s.onlineText} maxFontSizeMultiplier={1.2}>Online — Llama 3.3 70B</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Messages ── */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderMessage}
        contentContainerStyle={s.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {/* ── Typing indicator ── */}
      {isTyping && <ChatTypingIndicator s={s} />}

      {/* ── Input ── */}
      <View style={s.inputBar}>
        <TextInput
          style={s.input}
          placeholder="Tell me what you did today..."
          placeholderTextColor={T.colors.t3}
          value={inputText}
          onChangeText={setInputText}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          multiline
          maxFontSizeMultiplier={1.2}
        />
        <TouchableOpacity
          style={[s.sendBtn, !inputText.trim() && { opacity: 0.4 }]}
          onPress={handleSend}
          disabled={!inputText.trim() || isTyping}
        >
          <Send size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const useS = (T: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.bg0 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 30, paddingBottom: T.spacing.px3, paddingHorizontal: T.spacing.page,
    borderBottomWidth: 0.5, borderBottomColor: T.colors.b1,
    backgroundColor: T.colors.bg1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatar: {
    width: 40, height: 40, borderRadius: T.radii.full,
    backgroundColor: T.colors.forgeDim,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,92,46,0.25)',
  },
  headerTitle: { fontSize: T.typography.sizes.body, fontWeight: '700', color: T.colors.t1 },
  onlineDot: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDotCircle: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.colors.green },
  onlineText: { fontSize: T.typography.sizes.caption, color: T.colors.t3, fontWeight: '500' },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: T.colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },

  // List
  list: { padding: T.spacing.page, gap: 12, paddingBottom: T.spacing.px2 },

  // Bubbles
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowAi: { justifyContent: 'flex-start' },
  msgRowUser: { justifyContent: 'flex-end' },
  avatarWrap: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: T.colors.forgeDim,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    right: -2
  },
  bubble: {
    maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: T.radii.lg,
  },
  bubbleAi: { backgroundColor: T.colors.bg1, borderBottomLeftRadius: 4, borderWidth: 0.5, borderColor: T.colors.b1 },
  bubbleUser: { backgroundColor: T.colors.forge, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: T.typography.sizes.bodyS, lineHeight: T.typography.sizes.bodyS * 1.5 },
  bubbleTextAi: { color: T.colors.t1 },
  bubbleTextUser: { color: '#fff', fontWeight: '500' },

  loggedBadge: {
    fontSize: 9, fontWeight: '700', color: T.colors.forge,
    letterSpacing: 0.8, marginBottom: 5,
    textTransform: 'uppercase',
  },

  // Activity Card inside chat bubble
  activityCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: T.colors.bg2, borderRadius: T.radii.lg,
    padding: 10, marginBottom: 10,
    borderWidth: 0.5, borderColor: T.colors.b1,
  },
  activityCardImage: {
    width: 48, height: 48,
  },
  activityCardInfo: { flex: 1 },
  activityCardBadge: {
    fontSize: 9, fontWeight: '800', color: T.colors.forge,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2,
  },
  activityCardName: {
    fontSize: 14, fontWeight: '700', color: T.colors.t1, marginBottom: 4,
  },
  activityCardStats: {
    flexDirection: 'row', gap: 10, flexWrap: 'wrap',
  },
  activityStat: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
  },
  activityStatText: {
    fontSize: 11, fontWeight: '600', color: T.colors.t3,
  },

  // Typing
  typingWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: T.spacing.page, paddingBottom: T.spacing.px2 },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.colors.forge },

  // Input bar
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    padding: 14, paddingBottom: Platform.OS === 'ios' ? 55 : 14,
    borderTopWidth: 0.5, borderTopColor: T.colors.b1,
    backgroundColor: T.colors.bg1,
  },
  input: {
    flex: 1, minHeight: 44, maxHeight: 120,
    backgroundColor: T.colors.bg2,
    borderRadius: T.radii.full, paddingHorizontal: T.spacing.px4, paddingVertical: 12,
    fontSize: T.typography.sizes.bodyS, color: T.colors.t1,
    borderWidth: 0.5, borderColor: T.colors.b1,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: T.colors.forge,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: T.colors.forge,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
});


