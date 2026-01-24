#!/bin/bash
# Script para corregir errores de Fonts.semiBold

echo "🔧 Corrigiendo errores de Fonts.semiBold..."

# Reemplazar Fonts.semiBold por Fonts.bold en todos los archivos TSX
find app -name "*.tsx" -type f -exec sed -i 's/Fonts\.semiBold/Fonts.bold/g' {} +

echo "✅ Corrección completada"
echo ""
echo "Archivos modificados:"
grep -r "Fonts.bold" app/ --include="*.tsx" -l | grep -E "(index|moldoctor|plantas|about|favorites|help|history|settings)\.tsx"

echo ""
echo "Verificando TypeScript..."
npm run check
