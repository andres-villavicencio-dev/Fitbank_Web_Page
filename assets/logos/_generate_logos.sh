#!/usr/bin/env bash
set -euo pipefail
out_dir="assets/logos"
mkdir -p "$out_dir"
make_svg(){
  local filename="$1"; shift
  local label="$*"
  cat > "$out_dir/$filename" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f0f6ff"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="14" fill="url(#bg)" stroke="#1c244d" stroke-width="2"/>
  <g>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="28" fill="#0b1020" font-weight="700">$label</text>
  </g>
</svg>
SVG
}

make_svg jep.svg "JEP"
make_svg mushuc_runa.svg "Mushuc Runa"
make_svg cooperativa_atuntaqui.svg "Coop. Atuntaqui"
make_svg cooperativa_la_dolorosa.svg "Coop. La Dolorosa"
make_svg cooperativa_vision_de_los_andes.svg "Visión de los Andes"
make_svg cooperativa_senor_de_giron.svg "Señor de Girón"
make_svg cooperativa_luz_del_valle.svg "Luz del Valle"
make_svg cooperativa_pilahuin_tio.svg "Pilahuin Tio"
make_svg global_bank_corp.svg "Global Bank Corp"
make_svg caribbean_financial.svg "Caribbean Financial"
make_svg central_america_united_bank.svg "Central America United Bank"
make_svg cooperativa_padre_julian_lorente.svg "Padre Julián Lorente"
make_svg banco_andino_del_peru.svg "Banco Andino del Perú"
make_svg financial_services_london.svg "Financial Services London"
