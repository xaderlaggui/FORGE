import { useRouter } from 'expo-router';
import { Flame, MapPin, Timer, User as UserIcon } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SpriteMascot } from '../../../../components/forge/SpriteMascot';
import { TypewriterText } from '../../../../components/forge/TypewriterText';
import { chatbotSpriteController } from '../../../../features/sprites/ChatbotSpriteController';
import { getSpriteForActivity } from '../../../../features/sprites/activity-sprite-map';
import { MascotImages } from '../../../../features/sprites/mascotImages';
import { Message } from '../../hooks/useChat';

export function ChatMessage({ item, s, T, user, animatedIds }: { item: Message, s: any, T: any, user: any, animatedIds: React.MutableRefObject<Set<string>> }) {
  const router = useRouter();
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <View style={[s.msgRow, item.isAi ? s.msgRowAi : s.msgRowUser]}>
      {item.isAi && (
        <View style={[s.avatarWrap, { backgroundColor: 'transparent' }]}>
          <Image
            source={item.spriteId ? chatbotSpriteController.getAssetSource(item.spriteId) : MascotImages.coach}
            style={{ width: 45, height: 45, resizeMode: 'contain', position: 'absolute', bottom: 1, left: -13 }}
          />
        </View>
      )}
      <View style={[s.bubble, item.isAi ? s.bubbleAi : s.bubbleUser]}>
        {/* Activity Card */}
        {item.logged && item.activity && (
          <View style={s.activityCard}>
            <View style={{ marginRight: 12, alignSelf: 'center', marginLeft: -5 }}>
              <SpriteMascot spriteId={getSpriteForActivity(item.activity.activityName, item.activity.type)} size="md" />
            </View>
            <View style={s.activityCardInfo}>
              <Text style={s.activityCardBadge}>{capitalize(item.activity.type)} Logged ✓</Text>
              <Text style={s.activityCardName}>{item.activity.activityName}</Text>
              <View style={s.activityCardStats}>
                {item.activity.durationMinutes > 0 && (
                  <View style={s.activityStat}>
                    <Timer size={11} color={T.colors.t3} />
                    <Text style={s.activityStatText}>{item.activity.durationMinutes} min</Text>
                  </View>
                )}
                {item.activity.distanceKm != null && item.activity.distanceKm > 0 && (
                  <View style={s.activityStat}>
                    <MapPin size={11} color={T.colors.forge} />
                    <Text style={[s.activityStatText, { color: T.colors.forge, fontWeight: '700' }]}>{item.activity.distanceKm} km</Text>
                  </View>
                )}
                {(item.activity.calories ?? 0) > 0 && (
                  <View style={s.activityStat}>
                    <Flame size={11} color={T.colors.t3} />
                    <Text style={s.activityStatText}>~{item.activity.calories} kcal</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
        {item.isAi ? (
          <TypewriterText
            style={[s.bubbleText, s.bubbleTextAi]}
            maxFontSizeMultiplier={1.2}
            text={item.text}
            delay={15}
            animate={!animatedIds.current.has(item.id)}
            onComplete={() => {
              animatedIds.current.add(item.id);
            }}
          />
        ) : (
          <Text style={[s.bubbleText, s.bubbleTextUser]} maxFontSizeMultiplier={1.2}>
            {item.text}
          </Text>
        )}
      </View>
      {!item.isAi && (
        <TouchableOpacity onPress={() => router.push('/settings')} activeOpacity={0.8}>
          <View style={[s.avatarWrap, { backgroundColor: T.colors.bg3, overflow: 'hidden' }]}>
            {(user?.photoURL || (user as any)?.photo_url) ? (
              <Image source={{ uri: user?.photoURL || (user as any)?.photo_url }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
            ) : (
              <UserIcon size={15} color={T.colors.t1} />
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
