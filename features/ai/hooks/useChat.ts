import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { FlatList } from 'react-native';
import { useNutrition } from '../../../features/nutrition/hooks/useNutrition';
import { useWorkouts } from '../../../features/workout/hooks/useWorkouts';
import { groqComplete, GroqMessage } from '../../../services/groq';
import { supabase } from '../../../services/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { COACH_SYSTEM_PROMPT } from '../../../constants/prompts';
import { chatbotSpriteController } from '../../../features/sprites/ChatbotSpriteController';

export interface LoggedActivity {
  activityName: string;
  type: string;
  durationMinutes: number;
  distanceKm?: number | null;
  calories?: number;
}

export type Message = {
  id: string;
  text: string;
  isAi: boolean;
  logged?: boolean;
  activity?: LoggedActivity;
  spriteId?: string;
};

export function useChat() {
  const { user } = useAuthStore();
  const { data: nutrition } = useNutrition();
  const { workouts } = useWorkouts();
  const queryClient = useQueryClient();

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! I'm your FORGE Coach. Tell me what you did today — like 'I ran 5km' — and I'll log it for you!",
      isAi: true,
      spriteId: 'smiling-coach'
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const historyRef = useRef<GroqMessage[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const animatedIds = useRef<Set<string>>(new Set(['1']));

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    setInputText('');

    const userBubble: Message = { id: Date.now().toString(), text: userMsg, isAi: false };
    setMessages(prev => [...prev, userBubble]);
    setIsTyping(true);

    historyRef.current.push({ role: 'user', content: userMsg });

    const recentWorkout = workouts?.[0];
    const caloriesEaten = nutrition?.totalCalories ?? 0;
    const dynamicPrompt = `${COACH_SYSTEM_PROMPT}\n\nCURRENT ATHLETE CONTEXT:\nAthlete: ${user?.displayName || 'Athlete'}\nStreak: ${(user as any)?.streak ?? 0} days\nCalories logged today: ${caloriesEaten} kcal\nLast workout: ${recentWorkout ? (recentWorkout.notes || `${recentWorkout.exercises.length} exercises on ${recentWorkout.date}`) : 'None recently'}\nUse this context to personalize your advice when relevant!`;

    try {
      const raw = await groqComplete(
        [
          { role: 'system', content: dynamicPrompt },
          ...historyRef.current,
        ],
        { max_tokens: 200, temperature: 0.75 }
      );

      let displayText = raw;
      let logged = false;
      let activity: LoggedActivity | undefined;

      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.action === 'log_activity' && user?.uid) {
            const actType = parsed.type || 'strength';
            const duration = parsed.durationMinutes ?? 0;
            const distance = parsed.distanceKm ?? null;

            const estCalories = parsed.calories ?? Math.round(duration * (actType === 'run' ? 10 : actType === 'walk' ? 4 : 5));
            const pace = parsed.pace ?? null;
            const steps = parsed.steps ?? null;

            let finalActivityName = parsed.activityName || 'Workout';
            finalActivityName = finalActivityName.charAt(0).toUpperCase() + finalActivityName.slice(1);

            const workoutId = `chat_${Date.now()}`;
            const { error } = await supabase.from('workouts').insert({
              id: workoutId,
              user_id: user.uid,
              date: dayjs().format('YYYY-MM-DD'),
              notes: finalActivityName,
              type: actType,
              exercises: [],
              "durationMin": duration,
              calories: estCalories,
              distanceKm: distance,
              pace: pace,
              steps: steps,
              created_at: new Date().toISOString(),
            });
            if (error) throw error;

            queryClient.invalidateQueries({ queryKey: ['workouts', user.uid] });

            displayText = parsed.message || 'Activity logged!';
            logged = true;
            activity = {
              activityName: finalActivityName,
              type: actType,
              durationMinutes: duration,
              distanceKm: distance,
              calories: estCalories,
            };
          }
        }
      } catch {
        // Not JSON — normal response
      }

      historyRef.current.push({ role: 'assistant', content: raw });
      const newMsgId = (Date.now() + 1).toString();
      const spriteConfig = chatbotSpriteController.getSpriteForMessage(userMsg, false, false);

      let finalSpriteId = 'smiling-coach';
      if (logged) {
        finalSpriteId = 'thumbs-up';
      }

      setMessages(prev => [...prev, {
        id: newMsgId,
        text: displayText,
        isAi: true,
        logged,
        activity,
        spriteId: finalSpriteId
      }]);

    } catch (err: any) {
      const errMsg = err?.message?.includes('not set')
        ? 'Add your EXPO_PUBLIC_GROQ_API_KEY in .env to chat with your coach!'
        : 'Sorry, I had trouble connecting. Try again in a moment!';

      const errorSpriteConfig = chatbotSpriteController.getSpriteForMessage(userMsg, false, true);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: errMsg,
        isAi: true,
        spriteId: errorSpriteConfig.spriteId
      }]);
    } finally {
      setIsTyping(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return {
    user,
    inputText, setInputText,
    messages,
    isTyping,
    flatListRef,
    animatedIds,
    handleSend
  };
}
