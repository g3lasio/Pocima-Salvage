import { useState, useRef, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Speech from "expo-speech";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { trpc } from "@/lib/trpc";

// Tipos para los mensajes del chat
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imageUri?: string;
  plantLinks?: { id: string; nombre: string }[];
  enfermedadLinks?: { id: string; nombre: string }[];
  triageLevel?: "green" | "yellow" | "red";
}

// Frases de humor del doctor para el saludo inicial
const DOCTOR_GREETINGS = [
  "¡Hola! Soy MolDoctor 🩺🌿 Tu médico digital con un toque de humor. ¿En qué puedo ayudarte hoy? Prometo no recetarte 'dos aspirinas y llámame mañana' 😄",
  "¡Bienvenido a mi consultorio virtual! Soy MolDoctor, experto en plantas medicinales y chistes malos. ¿Qué te trae por aquí? 🌿",
  "¡Hola, paciente! Soy MolDoctor. No te preocupes, mis diagnósticos son mejores que mis chistes... y eso ya es decir mucho 😉 ¿Cómo te sientes?",
];

const STORAGE_KEY = "@moldoctor_chat_history";

export default function MolDoctorScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // tRPC mutation para chat
  const chatMutation = trpc.moldoctor.chat.useMutation();

  // Cargar historial al iniciar
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Guardar historial cuando cambian los mensajes
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory();
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } else {
        // Mensaje de bienvenida inicial
        const greeting = DOCTOR_GREETINGS[Math.floor(Math.random() * DOCTOR_GREETINGS.length)];
        setMessages([{
          id: Date.now().toString(),
          role: "assistant",
          content: greeting,
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const saveChatHistory = async () => {
    try {
      const toSave = messages.slice(-50);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  const clearChatHistory = async () => {
    Alert.alert(
      "Limpiar historial",
      "¿Estás seguro de que quieres borrar toda la conversación?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(STORAGE_KEY);
            const greeting = DOCTOR_GREETINGS[Math.floor(Math.random() * DOCTOR_GREETINGS.length)];
            setMessages([{
              id: Date.now().toString(),
              role: "assistant",
              content: greeting,
              timestamp: new Date(),
            }]);
          },
        },
      ]
    );
  };

  const sendMessage = useCallback(async (text: string, imageUri?: string) => {
    if (!text.trim() && !imageUri) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim() || "Analiza esta imagen:",
      timestamp: new Date(),
      imageUri,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Preparar imagen en base64 si existe
      let imageBase64: string | undefined;
      let imageMimeType: string | undefined;

      if (imageUri) {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: 'base64',
        });
        imageBase64 = base64;
        imageMimeType = imageUri.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
      }

      // Preparar mensajes para el API
      const apiMessages = messages
        .filter(m => m.role === "user" || m.role === "assistant")
        .slice(-10)
        .map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));
      
      // Agregar el mensaje actual
      apiMessages.push({
        role: "user",
        content: text.trim() || "Analiza esta imagen:",
      });

      const response = await chatMutation.mutateAsync({
        messages: apiMessages,
        imageBase64,
        imageMimeType,
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
        triageLevel: response.triageLevel,
        plantLinks: response.plantLinks,
        enfermedadLinks: response.enfermedadLinks,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "¡Ay caramba! 🤕 Parece que tuve un problema técnico. Como decimos los doctores: 'Si al principio no funciona, reinicia y vuelve a intentar'. ¿Podrías enviar tu mensaje de nuevo?",
        timestamp: new Date(),
        triageLevel: "green",
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, chatMutation]);

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert("Permiso requerido", "Necesito acceso a tu galería para ver las imágenes.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert("Permiso requerido", "Necesito acceso a tu cámara para tomar fotos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const speakMessage = async (text: string) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    
    // Limpiar el texto de emojis para mejor pronunciación
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
    
    Speech.speak(cleanText, {
      language: "es-MX",
      pitch: 0.95,
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const navigateToPlanta = (plantaId: string) => {
    router.push({
      pathname: "/planta-expandida-detail",
      params: { id: plantaId },
    });
  };

  const navigateToEnfermedad = (enfermedadId: string) => {
    router.push({
      pathname: "/enfermedad-expandida-detail",
      params: { id: enfermedadId, sistemaId: "general" },
    });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    
    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
          {
            backgroundColor: isUser ? colors.tint : colors.surface,
            borderColor: isUser ? colors.tint : colors.border,
          },
        ]}
      >
        {!isUser && (
          <View style={styles.doctorHeader}>
            <ThemedText style={styles.doctorEmoji}>🩺</ThemedText>
            <ThemedText style={[styles.doctorName, { color: colors.tint }]}>
              MolDoctor
            </ThemedText>
            {item.triageLevel && (
              <View
                style={[
                  styles.triageBadge,
                  {
                    backgroundColor:
                      item.triageLevel === "green"
                        ? "#4CAF50"
                        : item.triageLevel === "yellow"
                        ? "#FFC107"
                        : "#F44336",
                  },
                ]}
              />
            )}
          </View>
        )}
        
        {item.imageUri && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.imageUri }} 
              style={styles.messageImage}
              resizeMode="cover"
            />
          </View>
        )}
        
        <ThemedText
          style={[
            styles.messageText,
            { color: isUser ? "#FFFFFF" : colors.text },
          ]}
        >
          {item.content}
        </ThemedText>

        {/* Enlaces a plantas */}
        {item.plantLinks && item.plantLinks.length > 0 && (
          <View style={styles.linksContainer}>
            <ThemedText style={[styles.linksTitle, { color: colors.textSecondary }]}>
              🌿 Plantas mencionadas:
            </ThemedText>
            {item.plantLinks.map((planta, index) => (
              <Pressable
                key={index}
                onPress={() => navigateToPlanta(planta.id)}
                style={[styles.linkButton, { backgroundColor: `${colors.tint}20` }]}
              >
                <ThemedText style={[styles.linkText, { color: colors.tint }]}>
                  {planta.nombre}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        )}

        {/* Enlaces a enfermedades */}
        {item.enfermedadLinks && item.enfermedadLinks.length > 0 && (
          <View style={styles.linksContainer}>
            <ThemedText style={[styles.linksTitle, { color: colors.textSecondary }]}>
              🏥 Condiciones mencionadas:
            </ThemedText>
            {item.enfermedadLinks.map((enfermedad, index) => (
              <Pressable
                key={index}
                onPress={() => navigateToEnfermedad(enfermedad.id)}
                style={[styles.linkButton, { backgroundColor: `${colors.warning}20` }]}
              >
                <ThemedText style={[styles.linkText, { color: colors.warning }]}>
                  {enfermedad.nombre}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        )}
        
        {!isUser && (
          <Pressable
            onPress={() => speakMessage(item.content)}
            style={[styles.speakButton, { borderColor: colors.border }]}
          >
            <ThemedText style={{ fontSize: 16 }}>
              {isSpeaking ? "🔇 Detener" : "🔊 Escuchar"}
            </ThemedText>
          </Pressable>
        )}
        
        <ThemedText
          style={[
            styles.timestamp,
            { color: isUser ? "rgba(255,255,255,0.7)" : colors.textTertiary },
          ]}
        >
          {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 20),
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={[styles.doctorAvatar, { backgroundColor: `${colors.tint}15` }]}>
            <ThemedText style={styles.avatarEmoji}>🩺🌿</ThemedText>
          </View>
          <View style={styles.headerText}>
            <ThemedText type="subtitle" style={{ color: colors.text }}>
              MolDoctor
            </ThemedText>
            <ThemedText style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
              Tu médico digital con humor
            </ThemedText>
          </View>
        </View>
        <Pressable onPress={clearChatHistory} style={styles.clearButton}>
          <ThemedText style={{ fontSize: 20 }}>🗑️</ThemedText>
        </Pressable>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.chatContainer,
          { paddingBottom: 20 },
        ]}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
          <ActivityIndicator size="small" color={colors.tint} />
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            MolDoctor está pensando... 🤔
          </ThemedText>
        </View>
      )}

      {/* Selected Image Preview */}
      {selectedImage && (
        <View style={[styles.selectedImageContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImagePreview} />
          <Pressable 
            onPress={() => setSelectedImage(null)}
            style={styles.removeImageButton}
          >
            <ThemedText style={{ fontSize: 16 }}>❌</ThemedText>
          </Pressable>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View
          style={[
            styles.inputContainer,
            {
              paddingBottom: Math.max(insets.bottom, 16),
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable
              onPress={handleCamera}
              style={[styles.actionButton, { backgroundColor: `${colors.tint}15` }]}
            >
              <ThemedText style={{ fontSize: 20 }}>📷</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleImagePicker}
              style={[styles.actionButton, { backgroundColor: `${colors.tint}15` }]}
            >
              <ThemedText style={{ fontSize: 20 }}>🖼️</ThemedText>
            </Pressable>
          </View>

          {/* Text Input */}
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="Cuéntame tus síntomas..."
              placeholderTextColor={colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
            />
          </View>

          {/* Send Button */}
          <Pressable
            onPress={() => sendMessage(inputText, selectedImage || undefined)}
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            style={[
              styles.sendButton,
              {
                backgroundColor: (inputText.trim() || selectedImage) ? colors.tint : `${colors.tint}30`,
              },
            ]}
          >
            <ThemedText style={{ fontSize: 20, color: "#FFF" }}>➤</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  headerText: {
    gap: 2,
  },
  headerSubtitle: {
    fontSize: 13,
  },
  clearButton: {
    padding: Spacing.sm,
  },
  chatContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  messageBubble: {
    maxWidth: "85%",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  doctorEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  doctorName: {
    fontSize: 13,
    fontWeight: "600",
  },
  triageBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing.xs,
  },
  imageContainer: {
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  messageImage: {
    width: "100%",
    height: 150,
    borderRadius: BorderRadius.md,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  linksContainer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  linksTitle: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  linkButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
    alignSelf: "flex-start",
  },
  linkText: {
    fontSize: 13,
    fontWeight: "500",
  },
  speakButton: {
    alignSelf: "flex-start",
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  timestamp: {
    fontSize: 11,
    marginTop: Spacing.xs,
    alignSelf: "flex-end",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: 14,
  },
  selectedImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  selectedImagePreview: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
  },
  removeImageButton: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 44,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
