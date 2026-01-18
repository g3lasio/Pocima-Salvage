import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useCallback, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Pressable,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { Colors, Spacing, BorderRadius } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { getPlantaExpandidaById } from "../data/plantas-expandidas";
import { getEnfermedadesParaPlanta } from "../data/cruce-datos";
import { sistemasCorporales } from "../data/enfermedades-expandidas";

// Iconos para contraindicaciones
const contraindicacionIconos: Record<string, string> = {
  embarazo: "🤰",
  ninos: "👶",
  hipertension: "❤️‍🩹",
  diabetes: "🩸",
  lactancia: "🍼",
  alergia: "🤧",
  medicamentos: "💊",
  otro: "⚠️",
};

const contraindicacionLabels: Record<string, string> = {
  embarazo: "Embarazo",
  ninos: "Niños",
  hipertension: "Hipertensión",
  diabetes: "Diabetes",
  lactancia: "Lactancia",
  alergia: "Alergias",
  medicamentos: "Medicamentos",
  otro: "Precaución",
};

export default function PlantaExpandidaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const planta = useMemo(() => getPlantaExpandidaById(id || ""), [id]);
  const [showNombresAlternativos, setShowNombresAlternativos] = useState(false);
  
  // Usar el cruce de datos para obtener enfermedades relacionadas
  const enfermedadesRelacionadas = useMemo(() => {
    if (!planta) return [];
    return getEnfermedadesParaPlanta(planta);
  }, [planta]);

  const handleEnfermedadPress = useCallback((enfermedadId: string, sistemaId: string) => {
    router.push({
      pathname: "/enfermedad-expandida-detail",
      params: { id: enfermedadId, sistemaId },
    });
  }, [router]);

  if (!planta) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorEmoji}>❌</ThemedText>
          <ThemedText>Planta no encontrada</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
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
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <ThemedText style={[styles.closeButtonText, { color: colors.tint }]}>✕</ThemedText>
        </Pressable>
        <ThemedText type="subtitle" style={styles.headerTitle} numberOfLines={1}>
          {planta.nombre}
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon and Category Badge */}
        <View style={styles.iconContainer}>
          <View style={[styles.mainIcon, { backgroundColor: `${colors.tint}15` }]}>
            <ThemedText style={styles.mainIconEmoji}>🌿</ThemedText>
          </View>
          <View style={[styles.categoriaBadge, { backgroundColor: `${colors.tint}15` }]}>
            <ThemedText style={[styles.categoriaBadgeText, { color: colors.tint }]}>
              {planta.categoria}
            </ThemedText>
          </View>
        </View>

        <ThemedText type="title" style={styles.title}>
          {planta.nombre}
        </ThemedText>
        
        <ThemedText style={[styles.nombreCientifico, { color: colors.textTertiary }]}>
          {planta.nombreCientifico}
        </ThemedText>

        <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
          {planta.descripcion}
        </ThemedText>

        {/* Nombres Alternativos por Región - Dropdown Colapsable */}
        {planta.nombresAlternativos && Object.keys(planta.nombresAlternativos).length > 0 && (
          <View style={styles.section}>
            <Pressable 
              onPress={() => setShowNombresAlternativos(!showNombresAlternativos)}
              style={[styles.dropdownHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.dropdownHeaderContent}>
                <ThemedText style={styles.dropdownIcon}>🌍</ThemedText>
                <ThemedText type="defaultSemiBold" style={{ color: colors.text }}>
                  Ver más nombres ({Object.keys(planta.nombresAlternativos).length} regiones)
                </ThemedText>
              </View>
              <ThemedText style={[styles.dropdownArrow, { color: colors.textTertiary }]}>
                {showNombresAlternativos ? '▲' : '▼'}
              </ThemedText>
            </Pressable>
            
            {showNombresAlternativos && (
              <View style={[styles.nombresContainer, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 0, borderTopWidth: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}>
                {Object.entries(planta.nombresAlternativos).map(([region, nombres], index) => {
                  const regionLabels: Record<string, string> = {
                    'España': '🇪🇸 España',
                    'Mexico': '🇲🇽 México',
                    'Argentina': '🇦🇷 Argentina',
                    'Colombia': '🇨🇴 Colombia',
                    'Peru': '🇵🇪 Perú',
                    'Chile': '🇨🇱 Chile',
                    'Centroamerica': '🌎 Centroamérica',
                    'Caribe': '🌴 Caribe',
                    'USA_English': '🇺🇸 EE.UU.',
                    'UK_English': '🇬🇧 Reino Unido',
                    'Indigena': '🏻 Indígena',
                    'Otros': '🌐 Otros',
                  };
                  return (
                    <View key={region}>
                      {index > 0 && <View style={[styles.nombresDivider, { backgroundColor: colors.border }]} />}
                      <View style={styles.nombresRow}>
                        <ThemedText style={[styles.nombresRegion, { color: colors.textTertiary }]}>
                          {regionLabels[region] || region}
                        </ThemedText>
                        <ThemedText style={[styles.nombresValue, { color: colors.text }]}>
                          {(nombres as string[]).join(', ')}
                        </ThemedText>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Propiedades */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            ✨ Propiedades Curativas
          </ThemedText>
          <View style={styles.propiedadesContainer}>
            {planta.propiedades.map((prop, index) => (
              <View 
                key={index} 
                style={[styles.propiedadBadge, { backgroundColor: `${colors.tint}15` }]}
              >
                <ThemedText style={[styles.propiedadText, { color: colors.tint }]}>
                  {prop}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Información de uso */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📋 Información de Uso
          </ThemedText>
          
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: colors.textTertiary }]}>
                Parte utilizable:
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {planta.parteUsable}
              </ThemedText>
            </View>
            
            <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: colors.textTertiary }]}>
                Dosis recomendada:
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {planta.dosis}
              </ThemedText>
            </View>
            
            <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: colors.textTertiary }]}>
                Preparación:
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {planta.preparacion}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Contraindicaciones */}
        {planta.contraindicaciones.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              ⚠️ Contraindicaciones
            </ThemedText>
            
            {planta.contraindicaciones.map((contra, index) => {
              // Manejar tanto strings como objetos de contraindicación
              const isString = typeof contra === 'string';
              const tipo = isString ? 'otro' : contra.tipo;
              const descripcion = isString ? contra : contra.descripcion;
              
              return (
                <View 
                  key={index}
                  style={[styles.contraCard, { backgroundColor: `${colors.danger}10`, borderColor: `${colors.danger}30` }]}
                >
                  <View style={styles.contraHeader}>
                    <ThemedText style={styles.contraIcon}>
                      {contraindicacionIconos[tipo] || "⚠️"}
                    </ThemedText>
                    <ThemedText style={[styles.contraLabel, { color: colors.danger }]}>
                      {contraindicacionLabels[tipo] || "Precaución"}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.contraDesc, { color: colors.textSecondary }]}>
                    {descripcion}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        )}

        {/* Sistemas relacionados */}
        {planta.sistemasRelacionados.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              🏥 Sistemas Corporales Relacionados
            </ThemedText>
            <View style={styles.sistemasContainer}>
              {planta.sistemasRelacionados.map((sistemaId, index) => {
                const sistema = sistemasCorporales.find(s => s.id === sistemaId);
                if (!sistema) return null;
                return (
                  <View 
                    key={index} 
                    style={[styles.sistemaBadge, { backgroundColor: `${colors.textTertiary}15` }]}
                  >
                    <ThemedText style={styles.sistemaIcon}>{sistema.icono}</ThemedText>
                    <ThemedText style={[styles.sistemaText, { color: colors.textSecondary }]}>
                      {sistema.nombre}
                    </ThemedText>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Enfermedades que puede tratar - CRUCE DE DATOS */}
        {enfermedadesRelacionadas.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              🩺 Enfermedades que Puede Ayudar a Tratar
            </ThemedText>
            <ThemedText style={[styles.sectionNote, { color: colors.textTertiary }]}>
              {enfermedadesRelacionadas.length} enfermedades relacionadas
            </ThemedText>

            {enfermedadesRelacionadas.map((enfermedad) => {
              const sistema = sistemasCorporales.find(s => s.id === enfermedad.sistemaId);
              
              return (
                <Pressable
                  key={enfermedad.id}
                  onPress={() => handleEnfermedadPress(enfermedad.id, enfermedad.sistemaId)}
                  style={({ pressed }) => [
                    styles.enfermedadCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <View style={styles.enfermedadHeader}>
                    <View style={[styles.enfermedadIcon, { backgroundColor: `${colors.tint}15` }]}>
                      <ThemedText style={styles.enfermedadEmoji}>{sistema?.icono || "🩺"}</ThemedText>
                    </View>
                    <View style={styles.enfermedadInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.enfermedadName}>
                        {enfermedad.nombre}
                      </ThemedText>
                      <ThemedText style={[styles.enfermedadSistema, { color: colors.textTertiary }]}>
                        {sistema?.nombre || "Sistema"}
                      </ThemedText>
                    </View>
                    <ThemedText style={{ color: colors.textTertiary, fontSize: 20 }}>›</ThemedText>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: `${colors.warning}15`, borderColor: colors.warning }]}>
          <ThemedText style={styles.disclaimerIcon}>⚠️</ThemedText>
          <ThemedText style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            Esta información es solo orientativa y no sustituye el consejo médico profesional. Consulta siempre con un profesional de la salud antes de usar cualquier planta medicinal.
          </ThemedText>
        </View>
      </ScrollView>
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
  },
  headerSpacer: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  mainIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  mainIconEmoji: {
    fontSize: 40,
  },
  categoriaBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoriaBadgeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  nombreCientifico: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  sectionNote: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
    marginTop: -Spacing.sm,
  },
  propiedadesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  propiedadBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  propiedadText: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  infoRow: {
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    lineHeight: 22,
  },
  infoDivider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  contraCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  contraHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  contraIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  contraLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  contraDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 26,
  },
  sistemasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  sistemaBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  sistemaIcon: {
    fontSize: 16,
  },
  sistemaText: {
    fontSize: 13,
  },
  enfermedadCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  enfermedadHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  enfermedadIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  enfermedadEmoji: {
    fontSize: 18,
  },
  enfermedadInfo: {
    flex: 1,
  },
  enfermedadName: {
    fontSize: 15,
    lineHeight: 20,
  },
  enfermedadSistema: {
    fontSize: 12,
    lineHeight: 16,
  },
  disclaimer: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.md,
  },
  disclaimerIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  dropdownHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  dropdownIcon: {
    fontSize: 18,
  },
  dropdownArrow: {
    fontSize: 12,
  },
  nombresContainer: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  nombresRow: {
    paddingVertical: Spacing.sm,
  },
  nombresRegion: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  nombresValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  nombresDivider: {
    height: 1,
    marginVertical: Spacing.xs,
  },
});
