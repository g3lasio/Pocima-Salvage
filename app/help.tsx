import { StyleSheet, View, ScrollView, Pressable, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";

import { ThemedText } from "@/components/themed-text";
import { GlassBackground } from "@/components/ui/glass-background";
import { IronManColors, Spacing, Fonts, BorderRadius } from "@/constants/theme";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "¿Qué es Pócima Salvaje?",
    answer: "Pócima Salvaje es una aplicación de medicina natural que te permite consultar información sobre plantas medicinales, enfermedades y tratamientos naturales. Incluye MolDoctor, un asistente virtual especializado en medicina natural."
  },
  {
    question: "¿Cómo uso MolDoctor?",
    answer: "Ve a la pestaña MolDoctor y escribe tu consulta sobre salud o plantas medicinales. El doctor te responderá con información basada en medicina natural. Puedes adjuntar imágenes para consultas más específicas."
  },
  {
    question: "¿La información reemplaza al médico?",
    answer: "No. La información proporcionada es solo con fines educativos. Siempre consulta a un profesional de la salud antes de iniciar cualquier tratamiento, especialmente si tienes condiciones médicas preexistentes."
  },
  {
    question: "¿Cómo agrego favoritos?",
    answer: "Al ver el detalle de una planta o enfermedad, toca el icono de estrella para agregarla a tus favoritos. Puedes acceder a ellos desde el menú lateral."
  },
  {
    question: "¿Puedo usar la app sin internet?",
    answer: "La base de datos de plantas y enfermedades está disponible sin conexión. Sin embargo, MolDoctor requiere conexión a internet para funcionar."
  },
  {
    question: "¿Cómo cambio el idioma?",
    answer: "Ve a Configuración desde el menú lateral y selecciona tu idioma preferido (Español o English)."
  },
];

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(prev => prev === index ? null : index);
  };

  return (
    <GlassBackground showGrid={true} showCorners={true} showScanLine={false}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backIcon}>←</ThemedText>
        </Pressable>
        <ThemedText type="title" style={styles.title}>Ayuda</ThemedText>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <View style={styles.introSection}>
          <ThemedText style={styles.introEmoji}>❓</ThemedText>
          <ThemedText style={styles.introTitle}>¿Cómo podemos ayudarte?</ThemedText>
          <ThemedText style={styles.introText}>
            Encuentra respuestas a las preguntas más frecuentes o contáctanos directamente.
          </ThemedText>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preguntas Frecuentes</ThemedText>
          
          {faqs.map((faq, index) => (
            <Pressable
              key={index}
              onPress={() => toggleFAQ(index)}
              style={styles.faqItem}
            >
              <View style={styles.faqHeader}>
                <ThemedText style={styles.faqQuestion}>{faq.question}</ThemedText>
                <ThemedText style={styles.faqIcon}>
                  {expandedIndex === index ? "−" : "+"}
                </ThemedText>
              </View>
              {expandedIndex === index && (
                <ThemedText style={styles.faqAnswer}>{faq.answer}</ThemedText>
              )}
            </Pressable>
          ))}
        </View>

        {/* Contacto */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>¿Necesitas más ayuda?</ThemedText>
          
          <Pressable
            onPress={() => Linking.openURL("mailto:info@chyrris.com")}
            style={styles.contactCard}
          >
            <View style={styles.contactIcon}>
              <ThemedText style={styles.contactEmoji}>📧</ThemedText>
            </View>
            <View style={styles.contactInfo}>
              <ThemedText style={styles.contactTitle}>Escríbenos</ThemedText>
              <ThemedText style={styles.contactText}>info@chyrris.com</ThemedText>
            </View>
            <ThemedText style={styles.contactArrow}>›</ThemedText>
          </Pressable>

          <ThemedText style={styles.responseTime}>
            Tiempo de respuesta: 24-48 horas
          </ThemedText>
        </View>
      </ScrollView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: IronManColors.glassBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 20,
    color: IronManColors.textPrimary,
  },
  title: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  introSection: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  introEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  introTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: IronManColors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  introText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: IronManColors.textPrimary,
    marginBottom: Spacing.md,
  },
  faqItem: {
    backgroundColor: IronManColors.glassBlue,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQuestion: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: IronManColors.textPrimary,
    flex: 1,
    paddingRight: Spacing.md,
  },
  faqIcon: {
    fontSize: 20,
    color: IronManColors.arcReactorBlue,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: IronManColors.textSecondary,
    marginTop: Spacing.md,
    lineHeight: 22,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: IronManColors.glassBlue,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: IronManColors.glassDarkMedium,
    justifyContent: "center",
    alignItems: "center",
  },
  contactEmoji: {
    fontSize: 24,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: IronManColors.textPrimary,
    marginBottom: 2,
  },
  contactText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: IronManColors.arcReactorBlue,
  },
  contactArrow: {
    fontSize: 20,
    color: IronManColors.textTertiary,
  },
  responseTime: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
    textAlign: "center",
    marginTop: Spacing.md,
  },
});
