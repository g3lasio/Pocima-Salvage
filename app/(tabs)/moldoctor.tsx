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
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Speech from "expo-speech";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedText } from "../../components/themed-text";

import { GlassBackground } from "../../components/ui/glass-background";
import { Colors, Spacing, BorderRadius, Shadows, IronManColors, Fonts } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { moldoctorRequest, MOLDOCTOR_API } from "../../constants/api";

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
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;

  // API call function
  const callMolDoctorAPI = async (data: any) => {
    return await moldoctorRequest(MOLDOCTOR_API.CHAT, data);
  };

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

  // Animación del menú
  useEffect(() => {
    Animated.spring(menuAnimation, {
      toValue: showAttachMenu ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [showAttachMenu]);

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
      content: text.trim() || "Por favor analiza esta imagen médica:",
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
        // Detectar tipo de imagen
        if (imageUri.toLowerCase().endsWith('.png')) {
          imageMimeType = 'image/png';
        } else if (imageUri.toLowerCase().endsWith('.gif')) {
          imageMimeType = 'image/gif';
        } else if (imageUri.toLowerCase().endsWith('.webp')) {
          imageMimeType = 'image/webp';
        } else {
          imageMimeType = 'image/jpeg';
        }
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
        content: text.trim() || "Por favor analiza esta imagen médica. Si contiene texto (como resultados de laboratorio, recetas o documentos médicos), extrae y analiza la información. Si es una foto de síntomas (heridas, manchas, erupciones), describe lo que ves y proporciona orientación.",
      });

      const response = await callMolDoctorAPI({
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
  }, [messages]);

  const handleImagePicker = async () => {
    setShowAttachMenu(false);
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
    setShowAttachMenu(false);
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

  const handleDocumentPicker = async () => {
    setShowAttachMenu(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.mimeType?.startsWith("image/")) {
          setSelectedImage(asset.uri);
        } else if (asset.mimeType === "application/pdf") {
          // Para PDFs, mostrar alerta de que se procesará
          Alert.alert(
            "PDF seleccionado",
            "El documento será enviado para análisis. MolDoctor extraerá el texto y lo analizará.",
            [
              { text: "Cancelar", style: "cancel" },
              { 
                text: "Enviar", 
                onPress: () => {
                  // Por ahora, informar que PDFs requieren procesamiento especial
                  setInputText("He adjuntado un documento PDF para análisis.");
                }
              }
            ]
          );
        }
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "No se pudo seleccionar el documento.");
    }
  };

  const speakMessage = (text: string) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(text, {
        language: "es-MX",
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
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
            backgroundColor: isUser ? IronManColors.glassBlueMedium : colors.glass,
            borderColor: isUser ? IronManColors.arcReactorBlue : colors.border,
            ...(isUser ? {} : Shadows.small),
          },
        ]}
      >{!isUser && (
          <View style={styles.doctorHeader}>
            <View style={[styles.doctorAvatarSmall, { backgroundColor: IronManColors.glassBlue, borderColor: IronManColors.borderHoloSubtle }]}>
              <ThemedText style={styles.doctorEmoji}>🩺</ThemedText>
            </View>
            <ThemedText style={[styles.doctorName, { color: IronManColors.arcReactorBlue }]}>
              MolDoctor
            </ThemedText>
            {item.triageLevel && (
              <View
                style={[
                  styles.triageBadge,
                  {
                    backgroundColor:
                      item.triageLevel === "green"
                        ? "#00E676"
                        : item.triageLevel === "yellow"
                        ? IronManColors.jarvisAmber
                        : IronManColors.warningRed,
                  },
                ]}
              />
            )}
          </View>
        )}{item.imageUri && (
          <View style={[styles.imageContainer, { borderColor: colors.border }]}>
            <Image source={{ uri: item.imageUri }} style={styles.messageImage} resizeMode="cover" />
          </View>
        )}<ThemedText style={[styles.messageText, { color: colors.text }]}>
          {item.content}
        </ThemedText>{(item.plantLinks?.length || item.enfermedadLinks?.length) && (
          <View style={[styles.linksContainer, { borderTopColor: colors.border }]}>{item.plantLinks && item.plantLinks.length > 0 && (
              <View>
                <ThemedText style={[styles.linksTitle, { color: IronManColors.holographicCyan }]}>
                  🌿 Plantas mencionadas:
                </ThemedText>
                <View style={styles.linksRow}>
                  {item.plantLinks.map((planta) => (
                    <Pressable
                      key={planta.id}
                      onPress={() => navigateToPlanta(planta.id)}
                      style={[styles.linkButton, { backgroundColor: IronManColors.glassBlue, borderColor: IronManColors.borderHoloSubtle }]}
                    >
                      <ThemedText style={[styles.linkText, { color: IronManColors.arcReactorBlue }]}>
                        {planta.nombre}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}{item.enfermedadLinks && item.enfermedadLinks.length > 0 && (
              <View>
                <ThemedText style={[styles.linksTitle, { color: IronManColors.jarvisAmber }]}>
                  🏥 Condiciones relacionadas:
                </ThemedText>
                <View style={styles.linksRow}>
                  {item.enfermedadLinks.map((enfermedad) => (
                    <Pressable
                      key={enfermedad.id}
                      onPress={() => navigateToEnfermedad(enfermedad.id)}
                      style={[styles.linkButton, { backgroundColor: IronManColors.glassBlue, borderColor: IronManColors.borderHoloSubtle }]}
                    >
                      <ThemedText style={[styles.linkText, { color: IronManColors.jarvisAmber }]}>
                        {enfermedad.nombre}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}</View>
        )}{!isUser && (
          <Pressable
            onPress={() => speakMessage(item.content)}
            style={[styles.speakButton, { backgroundColor: IronManColors.glassBlue, borderColor: IronManColors.borderHoloSubtle }]}
          >
            <ThemedText style={{ fontSize: 14, color: IronManColors.holographicCyan }}>
              {isSpeaking ? "⏹️ Detener" : "🔊 Escuchar"}
            </ThemedText>
          </Pressable>
        )}</View>
    );
  };

  const renderAttachMenu = () => {
    const translateY = menuAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <Modal
        visible={showAttachMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAttachMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowAttachMenu(false)}>
          <View style={styles.attachMenuOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.attachMenuContainer,
                  {
                    transform: [{ translateY }],
                    paddingBottom: Math.max(insets.bottom, 20),
                  },
                ]}
              >
                <Pressable
                  onPress={handleCamera}
                  style={styles.attachMenuItem}
                >
                  <View style={[styles.attachMenuIcon, { backgroundColor: "#4CAF50" }]}>
                    <ThemedText style={styles.attachMenuEmoji}>📸</ThemedText>
                  </View>
                  <ThemedText style={styles.attachMenuLabel}>Cámara</ThemedText>
                  <ThemedText style={styles.attachMenuDesc}>Tomar foto</ThemedText>
                </Pressable>

                <Pressable
                  onPress={handleImagePicker}
                  style={styles.attachMenuItem}
                >
                  <View style={[styles.attachMenuIcon, { backgroundColor: "#2196F3" }]}>
                    <ThemedText style={styles.attachMenuEmoji}>🖼️</ThemedText>
                  </View>
                  <ThemedText style={styles.attachMenuLabel}>Galería</ThemedText>
                  <ThemedText style={styles.attachMenuDesc}>Seleccionar imagen</ThemedText>
                </Pressable>

                <Pressable
                  onPress={handleDocumentPicker}
                  style={styles.attachMenuItem}
                >
                  <View style={[styles.attachMenuIcon, { backgroundColor: "#FF9800" }]}>
                    <ThemedText style={styles.attachMenuEmoji}>📄</ThemedText>
                  </View>
                  <ThemedText style={styles.attachMenuLabel}>Documento</ThemedText>
                  <ThemedText style={styles.attachMenuDesc}>PDF o imagen</ThemedText>
                </Pressable>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <GlassBackground showGrid={true} showCorners={true} showScanLine={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + Spacing.sm,
              backgroundColor: colors.background,
              borderBottomColor: IronManColors.borderHolo,
            },
          ]}
        >
          <View style={styles.headerContent}>
            <View style={[styles.doctorAvatar, { backgroundColor: IronManColors.glassBlue, borderColor: IronManColors.arcReactorBlue }]}>
              <ThemedText style={styles.avatarEmoji}>🩺</ThemedText>
            </View>
            <View style={styles.headerText}>
              <ThemedText type="subtitle" style={{ color: IronManColors.arcReactorBlue }}>
                MolDoctor
              </ThemedText>
              <ThemedText style={[styles.headerSubtitle, { color: IronManColors.holographicCyan }]}>
                Tu médico virtual 🌿
              </ThemedText>
            </View>
          </View>
          <Pressable onPress={clearChatHistory} style={styles.clearButton}>
            <ThemedText style={{ color: IronManColors.textTertiary, fontSize: 20 }}>🗑️</ThemedText>
          </Pressable>
        </View>

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Loading indicator */}
        {isLoading && (
          <View style={[styles.loadingContainer, { backgroundColor: colors.glass, borderColor: colors.border }]}>
            <ActivityIndicator color={IronManColors.arcReactorBlue} />
            <ThemedText style={[styles.loadingText, { color: IronManColors.holographicCyan }]}>
              MolDoctor está analizando...
            </ThemedText>
          </View>
        )}

        {/* Selected Image Preview */}
        {selectedImage && (
          <View style={[styles.selectedImageContainer, { backgroundColor: colors.glass, borderColor: colors.border }]}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImagePreview} />
            <ThemedText style={{ flex: 1, marginLeft: Spacing.sm, color: colors.text }}>
              Imagen lista para enviar
            </ThemedText>
            <Pressable onPress={() => setSelectedImage(null)} style={styles.removeImageButton}>
              <ThemedText style={{ color: IronManColors.warningRed, fontSize: 18 }}>✕</ThemedText>
            </Pressable>
          </View>
        )}

        {/* Input Area */}
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
          {/* Botón + para adjuntos */}
          <Pressable
            onPress={() => setShowAttachMenu(true)}
            style={[
              styles.plusButton,
              { 
                backgroundColor: showAttachMenu ? IronManColors.arcReactorBlue : IronManColors.glassBlue,
                borderColor: IronManColors.borderHoloSubtle,
              }
            ]}
          >
            <ThemedText style={[styles.plusIcon, { color: showAttachMenu ? "#FFF" : IronManColors.arcReactorBlue }]}>
              +
            </ThemedText>
          </Pressable>

          {/* Text Input */}
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: colors.glass,
                borderColor: colors.border,
              },
            ]}
          >
            <TextInput
              style={[styles.textInput, { color: colors.text, fontFamily: Fonts.regular }]}
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
                backgroundColor: (inputText.trim() || selectedImage) ? IronManColors.arcReactorBlue : IronManColors.glassBlue,
                borderWidth: 1.5,
                borderColor: (inputText.trim() || selectedImage) ? IronManColors.arcReactorBlue : IronManColors.borderHoloSubtle,
                ...((inputText.trim() || selectedImage) ? Shadows.glow : {}),
              },
            ]}
          >
            <ThemedText style={{ fontSize: 20, color: "#FFF" }}>➤</ThemedText>
          </Pressable>
        </View>

        {/* Menú de adjuntos */}
        {renderAttachMenu()}
      </KeyboardAvoidingView>
    </GlassBackground>
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
    borderBottomWidth: 1.5,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
    borderWidth: 1.5,
  },
  avatarEmoji: {
    fontSize: 26,
  },
  headerText: {
    gap: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    letterSpacing: 0.3,
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
    borderWidth: 1.5,
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
    marginBottom: Spacing.sm,
  },
  doctorAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.xs,
    borderWidth: 1,
  },
  doctorEmoji: {
    fontSize: 14,
  },
  doctorName: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  triageBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: Spacing.sm,
  },
  imageContainer: {
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
  },
  messageImage: {
    width: "100%",
    height: 150,
    borderRadius: BorderRadius.md,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.2,
    fontFamily: Fonts.regular,
  },
  linksContainer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  linksTitle: {
    fontSize: 12,
    marginBottom: Spacing.xs,
    fontWeight: "600",
  },
  linksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.xs,
  },
  linkButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
    borderWidth: 1,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "500",
  },
  speakButton: {
    alignSelf: "flex-start",
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  timestamp: {
    fontSize: 11,
    marginTop: Spacing.xs,
    alignSelf: "flex-end",
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    borderWidth: 1,
  },
  loadingText: {
    fontSize: 14,
    letterSpacing: 0.3,
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
    borderTopWidth: 1.5,
    gap: Spacing.sm,
  },
  plusButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  plusIcon: {
    fontSize: 28,
    fontWeight: "300",
    lineHeight: 32,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 46,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    maxHeight: 100,
    letterSpacing: 0.2,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  // Menú de adjuntos
  attachMenuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  attachMenuContainer: {
    position: "absolute",
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: IronManColors.darkBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: IronManColors.borderHolo,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  attachMenuItem: {
    alignItems: "center",
    padding: Spacing.sm,
  },
  attachMenuIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  attachMenuEmoji: {
    fontSize: 28,
  },
  attachMenuLabel: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: IronManColors.textPrimary,
  },
  attachMenuDesc: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
  },
});
