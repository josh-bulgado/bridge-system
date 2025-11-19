import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  Upload,
  FileImage,
  ArrowLeft,
  CheckCircle,
  X,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

// List of regions in the Philippines
const PHILIPPINE_REGIONS = [
  "Region I - Ilocos Region",
  "Region II - Cagayan Valley",
  "Region III - Central Luzon",
  "Region IV-A - CALABARZON",
  "Region IV-B - MIMAROPA",
  "Region V - Bicol Region",
  "Region VI - Western Visayas",
  "Region VII - Central Visayas",
  "Region VIII - Eastern Visayas",
  "Region IX - Zamboanga Peninsula",
  "Region X - Northern Mindanao",
  "Region XI - Davao Region",
  "Region XII - SOCCSKSARGEN",
  "Region XIII - Caraga",
  "NCR - National Capital Region (Metro Manila)",
  "CAR - Cordillera Administrative Region",
  "BARMM - Bangsamoro Autonomous Region in Muslim Mindanao",
];

// Mapping of regions to provinces
const PROVINCES_BY_REGION: Record<string, string[]> = {
  "Region I - Ilocos Region": ["Ilocos Norte", "Ilocos Sur", "La Union", "Pangasinan"],
  "Region II - Cagayan Valley": ["Batanes", "Cagayan", "Isabela", "Nueva Vizcaya", "Quirino"],
  "Region III - Central Luzon": ["Aurora", "Bataan", "Bulacan", "Nueva Ecija", "Pampanga", "Tarlac", "Zambales"],
  "Region IV-A - CALABARZON": ["Batangas", "Cavite", "Laguna", "Quezon", "Rizal"],
  "Region IV-B - MIMAROPA": ["Marinduque", "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Romblon"],
  "Region V - Bicol Region": ["Albay", "Camarines Norte", "Camarines Sur", "Catanduanes", "Masbate", "Sorsogon"],
  "Region VI - Western Visayas": ["Aklan", "Antique", "Capiz", "Guimaras", "Iloilo", "Negros Occidental"],
  "Region VII - Central Visayas": ["Bohol", "Cebu", "Negros Oriental", "Siquijor"],
  "Region VIII - Eastern Visayas": ["Biliran", "Eastern Samar", "Leyte", "Northern Samar", "Samar", "Southern Leyte"],
  "Region IX - Zamboanga Peninsula": ["Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"],
  "Region X - Northern Mindanao": ["Bukidnon", "Camiguin", "Lanao del Norte", "Misamis Occidental", "Misamis Oriental"],
  "Region XI - Davao Region": ["Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental"],
  "Region XII - SOCCSKSARGEN": ["Cotabato", "Sarangani", "South Cotabato", "Sultan Kudarat"],
  "Region XIII - Caraga": ["Agusan del Norte", "Agusan del Sur", "Dinagat Islands", "Surigao del Norte", "Surigao del Sur"],
  "NCR - National Capital Region (Metro Manila)": [],
  "CAR - Cordillera Administrative Region": ["Abra", "Apayao", "Benguet", "Ifugao", "Kalinga", "Mountain Province"],
  "BARMM - Bangsamoro Autonomous Region in Muslim Mindanao": ["Basilan", "Lanao del Sur", "Maguindanao", "Sulu", "Tawi-Tawi"],
};

// List of barangays per city/municipality (sample data for major cities)
const BARANGAYS_BY_CITY: Record<string, string[]> = {
  // Albay Province - Complete barangay list
  "Legazpi City": ["Barangay 1 - Em's Barrio", "Barangay 2 - Em's Barrio South", "Barangay 3 - Em's Barrio East", "Barangay 4 - Sagpon", "Barangay 5 - Sagmin", "Barangay 6 - Bañadero", "Barangay 7 - Baño", "Barangay 8 - Bagumbayan", "Barangay 9 - Pinaric", "Barangay 10 - Cabugao", "Barangay 11 - Maoyod", "Barangay 12 - Tula-tula", "Barangay 13 - Ilawod West", "Barangay 14 - Ilawod", "Barangay 15 - Ilawod East", "Barangay 16 - Kawit-East Washington Drive", "Barangay 17 - Rizal Street, Ilawod", "Barangay 18 - Cabagñan West", "Barangay 19 - Cabagñan", "Barangay 20 - Cabagñan East", "Barangay 21 - Binanuahan West", "Barangay 22 - Binanuahan East", "Barangay 23 - Imperial Court Subd.", "Barangay 24 - Rizal Street", "Barangay 25 - Lapu-lapu", "Barangay 26 - Dinagaan", "Barangay 27 - Victory Village South", "Barangay 28 - Victory Village North", "Barangay 29 - Sabang", "Barangay 30 - Pigcale", "Barangay 31 - Centro-Baybay", "Barangay 32 - San Roque", "Barangay 33 - PNR-Peñaranda St.-Iraya", "Barangay 34 - Oro Site-Magallanes St.", "Barangay 35 - Tinago", "Barangay 36 - Kapantawan", "Barangay 37 - Bitano", "Barangay 38 - Gogon", "Barangay 39 - Bonot", "Barangay 40 - Cruzada", "Barangay 41 - Bogtong", "Barangay 42 - Rawis", "Barangay 43 - Tamaoyan", "Barangay 44 - Pawa", "Barangay 45 - Dita", "Barangay 46 - San Joaquin", "Barangay 47 - Arimbay", "Barangay 48 - Bagong Abre", "Barangay 49 - Bigaa", "Barangay 50 - Padang", "Barangay 51 - Buyuan", "Barangay 52 - Matanag", "Barangay 53 - Bonga", "Barangay 54 - Mabinit", "Barangay 55 - Estanza", "Barangay 56 - Taysan", "Barangay 57 - Dap-dap", "Barangay 58 - Buragwis", "Barangay 59 - Puro", "Barangay 60 - Lamba", "Barangay 61 - Maslog", "Barangay 62 - Homapon", "Barangay 63 - Mariawa", "Barangay 64 - Bagacay", "Barangay 65 - Imalnod", "Barangay 66 - Banquerohan", "Barangay 67 - Bariis", "Barangay 68 - San Francisco", "Barangay 69 - Buenavista", "Barangay 70 - Cagbacong"],
  "Ligao City": ["Allang", "Apad", "Bagalangit", "Bagumbayan", "Banao", "Batang", "Binatagan", "Binoto", "Bobonsuran", "Bonga", "Busac", "Cabarian", "Calbayog", "Calzada", "Cavasi", "Culliat", "Dinagaan", "Dungon", "Francia", "Guilid", "Herrera", "Himada", "Lazaga", "Macabugos", "Mahaba", "Malama", "Manaet", "Nasisi", "Otongon", "Palapas", "Pandan", "Paulba", "Paulog", "Pinagdapugan", "Pinit", "Ranzo-Borbor", "San Isidro", "Tagpo", "Tambo", "Tandarura", "Tastas", "Tinampo", "Tinago", "Tiocan", "Tomalaytay", "Tuburan"],
  "Tabaco City": ["Agnas", "Antipolo", "Bacolod", "Bangkilingan", "Bantayan", "Basud", "Bogtong", "Bombon", "Bonga", "Buhi", "Buhian", "Cabagñan", "Cagbulacao", "Cobo", "Comon", "Cormidal", "Divino Rostro", "Fatima", "Guinobat", "Magapo", "Matagbac", "Oras", "Oson", "Panal", "Pawa", "Pinagbobong", "Quinale Cabasan", "Quinastillojan", "Rawis", "Sagurong", "San Antonio", "San Carlos", "San Isidro", "San Juan", "San Lorenzo", "San Roque", "San Vicente", "Santa Cruz", "Saripongpong", "Sua-Igot", "Tabiguian", "Tagas", "Talisay", "Tayhi", "Tinago", "Visita"],
  "Bacacay": ["Amlongan", "Baclayon", "Balasbas", "Bariw", "Basud", "Bayandong", "Bonga", "Buang", "Cabasan", "Cagbulacao", "Cagraray", "Cajogutan", "Cawayan", "Damacan", "Gubat", "Hinipaan", "Langaton", "Manaet", "Mapulang Daga", "Misibis", "Nahapunan", "Namanday", "Napao", "Panarayon", "Pigcobohan", "San Rafael", "San Vicente Chico", "San Vicente Grande", "Santa Misericordia", "Sogod", "Tambilagao", "Travesia", "Banquerohan", "Baybay", "Bulao", "Busdac", "Cagbalogo", "Camagong", "Capacuan", "Cawayan Bogtong", "Hindi", "Igang", "Itulan", "Manaet-Baybay", "Maogog", "Mataas", "Paniman", "Pili", "San Antonio", "San Pedro", "Sogod Proper"],
  "Camalig": ["Baligang", "Bantonan", "Bariw", "Binitayan", "Biñan", "Bongalon", "Cabagñan", "Calabidongan", "Catamlangan", "Cotmon", "Del Rosario", "Gapo", "Gotob", "Ilawod", "Libod", "Ligban", "Mabunga", "Mapiña", "Nasaraogan", "Palanog", "Panoypoy", "Pariaan", "Quinartilan", "San Francisco", "San Jose", "San Pablo", "San Roque", "Santa Misericordia", "Saray", "Sua", "Sua-Igot", "Tagaytay", "Tambo", "Tapos", "Tinago", "Tumpa"],
  "Daraga": ["Alcala", "Alobo", "Anitipolo", "Bagumbayan", "Balinad", "Bañag", "Bascaran", "Bonga", "Budiao", "Busay", "Burgos", "Buyuan", "Del Rosario", "Gapo", "Ibo", "Kilicao", "Kimantong", "Mabini", "Malabog", "Malobago", "Mayon", "Market Site", "Mi-isi", "Nabasan", "Pandan", "Peñafrancia", "Sagpon", "Salvacion", "San Rafael", "San Ramon", "San Roque", "Santa Maria", "Tabon-Tabon", "Tuburan"],
  "Guinobatan": ["Batbat", "Binitayan", "Calzada", "Catomag", "Doña Tomasa", "Ilawod", "Inascan", "Inamnan Grande", "Inamnan Pequeño", "Maipon", "Manaet", "Mauraro", "Morera", "Muladbucad Grande", "Muladbucad Pequeño", "Ongo", "Pawa", "Pinid", "Poblacion", "Quibongbongan", "Quitago", "Sinungtan", "Tandarura", "Travesia"],
  "Jovellar": ["Alimsog", "Bagacay", "Batang", "Belen", "Bonifacio", "Cabraran Pequeño", "Camalig", "Casili", "Del Carmen", "Gapo", "La Medalla", "Maroroy", "Salvacion", "San Isidro", "Santa Cruz"],
  "Libon": ["Alongong", "Apud", "Bacolod", "Badbad", "Bagumbayan", "Balaba", "Baltazar", "Banao", "Bonbon", "Buga", "Bulusan", "Burabod", "Centro Poblacion I (Barangay 1)", "Centro Poblacion II (Barangay 2)", "Cuyapi", "Guilid", "Hacienda Mambalite", "Harigue", "Lagang", "Linao", "Macabugos", "Magallanes", "Marayag", "Matara", "Molosbolos", "Nogpo", "Oma-oma", "Pantao", "Ragragan", "Rawis", "Sampongan", "San Agustin", "San Antonio", "San Isidro", "San Jose", "San Juan", "San Pascual", "San Ramon", "San Vicente", "Santa Cruz", "Talib", "Tamaoyan", "Tanauan", "Tinampo", "Togawe", "Union"],
  "Malilipot": ["Barangay I (Poblacion)", "Barangay II (Poblacion)", "Barangay III (Poblacion)", "Barangay IV (Poblacion)", "Barangay V (Poblacion)", "Binitayan", "Canaway", "Calbayog", "Cotmon", "Mambong", "Matagbac", "Mataas", "Parada", "Salvacion", "San Antonio", "San Francisco Pob. (Bgy. VI)", "San Isidro", "San Jose", "San Roque", "Santa Cruz"],
  "Malinao": ["Barangay I (Poblacion)", "Barangay II (Poblacion)", "Barangay III (Poblacion)", "Barangay IV (Poblacion)", "Bacacay", "Balading", "Balza", "Banahao", "Baybay", "Binitayan", "Bonsobre", "Calbayog", "Cuta", "Estancia", "Maabang", "Malabnig", "Mampirao", "Ombao", "Tagoytoy", "Taladong"],
  "Manito": ["Pawa", "Tinapian"],
  "Oas": ["Badbad", "Badian", "Bagsa", "Bangkilingan", "Barangay 1 (Poblacion)", "Barangay 2 (Poblacion)", "Barangay 3 (Poblacion)", "Barangay 4 (Poblacion)", "Barangay 5 (Poblacion)", "Barangay 6 (Poblacion)", "Barangay 7 (Poblacion)", "Barangay 8 (Poblacion)", "Barangay 9 (Poblacion)", "Barangay 10 (Poblacion)", "Barangay 11 (Poblacion)", "Bibincahan", "Bongoran", "Borong-borong", "Buhatan", "Cagmanaba", "Calaguimit", "Calpi", "Cumadcad", "Gamot", "Gatbo", "Ilaor Norte", "Ilaor Sur", "Iraya", "Magurang", "Malabog", "Matnog", "Mayao", "Nagas", "Nahapunan", "Panoypoy", "Salvacion", "San Antonio", "San Isidro", "San Juan", "San Miguel", "San Pascual", "San Vicente", "Santa Teresita", "Tagdon", "Talongog", "Tobgon"],
  "Pio Duran": ["Agol", "Alabangpuro", "Bagumbayan", "Basicao Coastal", "Basicao Interior", "Bentuco", "Buyo", "Calatagan Nuevo", "Calatagan Viejo", "Casay", "Del Rosario", "La Medalla", "La Opinion", "La Purisima", "Macalva", "Mapaco", "Marigondon", "Matanglad", "Ogob", "Panarayon", "Poblacion", "San Antonio", "San Isidro", "San Jose", "San Juan", "San Ramon", "San Vicente Ogob", "San Vicente Viejo", "Santa Teresita", "Tepan"],
  "Polangui": ["Agos", "Alnay", "Amoguis", "Anislag", "Anoyop", "Asin", "Balaba", "Balangibang", "Balanglawis", "Balite", "Baliton", "Balubad", "Basud", "Belen", "Bubulusan", "Buyo", "Cagmanaba", "Cawayan", "Centro Poblacion East", "Centro Poblacion West", "Cotmon", "Chaguamayon", "Danao", "Gabon", "Gamot", "Itaran", "La Medalla", "La Purisima", "Lanigay", "Lidong", "Lourdes", "Magpanambo", "Magurang", "Maguiring", "Matacon", "Maynaga", "Mendez", "Ongo", "Pagi", "Ponso", "Salvacion", "San Roque", "Santicon", "Santo Niño", "Sugcad", "Tablo"],
  "Rapu-Rapu": ["Bagaobawan", "Batan", "Binosawan", "Buenavista", "Buhatan", "Calanaga", "Caracaran", "Carogcog", "Galicia", "Hamorawon", "Lagundi", "Linao", "Mancao", "Morocborocan", "Nagcalsot", "Poblacion", "Sagrada (Sagrada Familia)", "Tinopan", "Tinocolan", "Viga"],
  "Santo Domingo": ["Alimsog", "Baligang", "Banao", "Banuang Gurang", "Banuang Gurang Sur", "Basud", "Batang", "Bayandong", "Buraburan", "Calayucay", "Calomboyan", "Camanbingan", "Cañonoy", "Fidel Surtida (Catagbangan)", "Gotob", "Lidong", "Mabini", "Malabog", "Maramba", "Maynaga", "Pandayan", "San Andres (Poblacion)", "San Antonio", "San Isidro", "San Juan", "San Vicente", "Tagas", "Togawe", "Tomalaytay"],
  "Tiwi": ["Bagumbayan", "Bariis", "Baybay", "Belen", "Bolo", "Bonifacio", "Cale", "Cararayan", "Gajo", "Gango", "Joroan", "Matalipni", "Maynonong", "Misibis", "Nagas", "Naga-Naga", "Oyama", "Putsan", "Sogod"],
  "Manila": [
    // Tondo District (Barangays 1-267)
    "Barangay 1 (Tondo)", "Barangay 2 (Tondo)", "Barangay 3 (Tondo)", "Barangay 4 (Tondo)", "Barangay 5 (Tondo)",
    "Barangay 6 (Tondo)", "Barangay 7 (Tondo)", "Barangay 8 (Tondo)", "Barangay 9 (Tondo)", "Barangay 10 (Tondo)",
    // ... (abbreviated for space - would include all Tondo barangays)
    "Barangay 267 (Tondo)",
    // Binondo District (Barangays 287-296)
    "Barangay 287 (Binondo)", "Barangay 288 (Binondo)", "Barangay 289 (Binondo)", "Barangay 290 (Binondo)",
    "Barangay 291 (Binondo)", "Barangay 292 (Binondo)", "Barangay 293 (Binondo)", "Barangay 294 (Binondo)",
    "Barangay 295 (Binondo)", "Barangay 296 (Binondo)",
    // Quiapo District (Barangays 306-321)
    "Barangay 306 (Quiapo)", "Barangay 307 (Quiapo)", "Barangay 308 (Quiapo)", "Barangay 309 (Quiapo)",
    "Barangay 310 (Quiapo)", "Barangay 311 (Quiapo)", "Barangay 312 (Quiapo)", "Barangay 313 (Quiapo)",
    "Barangay 314 (Quiapo)", "Barangay 315 (Quiapo)", "Barangay 316 (Quiapo)", "Barangay 317 (Quiapo)",
    "Barangay 318 (Quiapo)", "Barangay 319 (Quiapo)", "Barangay 320 (Quiapo)", "Barangay 321 (Quiapo)",
    // San Nicolas District (Barangays 268-286)
    "Barangay 268 (San Nicolas)", "Barangay 269 (San Nicolas)", "Barangay 270 (San Nicolas)",
    // Sampaloc District (Barangays 395-636)
    "Barangay 395 (Sampaloc)", "Barangay 400 (Sampaloc)", "Barangay 500 (Sampaloc)", "Barangay 636 (Sampaloc)",
    // Santa Cruz District (Barangays 297-366)
    "Barangay 297 (Santa Cruz)", "Barangay 300 (Santa Cruz)", "Barangay 350 (Santa Cruz)",
    // Ermita District
    "Barangay 659 (Ermita)", "Barangay 660 (Ermita)", "Barangay 663 (Ermita)",
    // Intramuros District
    "Barangay 654 (Intramuros)", "Barangay 655 (Intramuros)", "Barangay 656 (Intramuros)",
    // Malate District
    "Barangay 719 (Malate)", "Barangay 720 (Malate)", "Barangay 730 (Malate)",
    // Paco District
    "Barangay 663 (Paco)", "Barangay 670 (Paco)", "Barangay 680 (Paco)",
    // Pandacan District
    "Barangay 819 (Pandacan)", "Barangay 820 (Pandacan)", "Barangay 830 (Pandacan)",
    // Port Area District
    "Barangay 649 (Port Area)", "Barangay 650 (Port Area)",
    // San Miguel District
    "Barangay 637 (San Miguel)", "Barangay 638 (San Miguel)", "Barangay 640 (San Miguel)",
    // Santa Ana District
    "Barangay 784 (Santa Ana)", "Barangay 790 (Santa Ana)", "Barangay 800 (Santa Ana)",
  ],
  // Add more cities with their barangays as needed
};

// List of cities/municipalities per province
const CITIES_BY_PROVINCE: Record<string, string[]> = {
  "Abra": ["Bangued", "Boliney", "Bucay", "Bucloc", "Daguioman", "Danglas", "Dolores", "La Paz", "Lacub", "Lagangilang", "Lagayan", "Langiden", "Licuan-Baay", "Luba", "Malibcong", "Manabo", "Peñarrubia", "Pidigan", "Pilar", "Sallapadan", "San Isidro", "San Juan", "San Quintin", "Tayum", "Tineg", "Tubo", "Villaviciosa"],
  "Agusan del Norte": ["Butuan City", "Cabadbaran City", "Buenavista", "Carmen", "Jabonga", "Kitcharao", "Las Nieves", "Magallanes", "Nasipit", "Remedios T. Romualdez", "Santiago", "Tubay"],
  "Agusan del Sur": ["Bayugan City", "Bunawan", "Esperanza", "La Paz", "Loreto", "Prosperidad", "Rosario", "San Francisco", "San Luis", "Santa Josefa", "Sibagat", "Talacogon", "Trento", "Veruela"],
  "Aklan": ["Altavas", "Balete", "Banga", "Batan", "Buruanga", "Ibajay", "Kalibo", "Lezo", "Libacao", "Madalag", "Makato", "Malay", "Malinao", "Nabas", "New Washington", "Numancia", "Tangalan"],
  "Albay": ["Legazpi City", "Ligao City", "Tabaco City", "Bacacay", "Camalig", "Daraga", "Guinobatan", "Jovellar", "Libon", "Malilipot", "Malinao", "Manito", "Oas", "Pio Duran", "Polangui", "Rapu-Rapu", "Santo Domingo", "Tiwi"],
  "Antique": ["San Jose de Buenavista", "Anini-y", "Barbaza", "Belison", "Bugasong", "Caluya", "Culasi", "Hamtic", "Laua-an", "Libertad", "Pandan", "Patnongon", "San Remigio", "Sebaste", "Sibalom", "Tibiao", "Tobias Fornier", "Valderrama"],
  "Apayao": ["Kabugao", "Calanasan", "Conner", "Flora", "Luna", "Pudtol", "Santa Marcela"],
  "Aurora": ["Baler", "Casiguran", "Dilasag", "Dinalungan", "Dingalan", "Dipaculao", "Maria Aurora", "San Luis"],
  "Basilan": ["Isabela City", "Lamitan City", "Akbar", "Al-Barka", "Hadji Mohammad Ajul", "Hadji Muhtamad", "Lantawan", "Maluso", "Sumisip", "Tabuan-Lasa", "Tipo-Tipo", "Tuburan", "Ungkaya Pukan"],
  "Bataan": ["Balanga City", "Abucay", "Bagac", "Dinalupihan", "Hermosa", "Limay", "Mariveles", "Morong", "Orani", "Orion", "Pilar", "Samal"],
  "Batanes": ["Basco", "Itbayat", "Ivana", "Mahatao", "Sabtang", "Uyugan"],
  "Batangas": ["Batangas City", "Lipa City", "Tanauan City", "Santo Tomas City", "Agoncillo", "Alitagtag", "Balayan", "Balete", "Bauan", "Calaca", "Calatagan", "Cuenca", "Ibaan", "Laurel", "Lemery", "Lian", "Lobo", "Mabini", "Malvar", "Mataas na Kahoy", "Nasugbu", "Padre Garcia", "Rosario", "San Jose", "San Juan", "San Luis", "San Nicolas", "San Pascual", "Santa Teresita", "Taal", "Talisay", "Taysan", "Tingloy", "Tuy"],
  "Benguet": ["Baguio City", "Atok", "Bakun", "Bokod", "Buguias", "Itogon", "Kabayan", "Kapangan", "Kibungan", "La Trinidad", "Mankayan", "Sablan", "Tuba", "Tublay"],
  "Biliran": ["Naval", "Almeria", "Biliran", "Cabucgayan", "Caibiran", "Culaba", "Kawayan", "Maripipi"],
  "Bohol": ["Tagbilaran City", "Alburquerque", "Alicia", "Anda", "Antequera", "Baclayon", "Balilihan", "Batuan", "Bien Unido", "Bilar", "Buenavista", "Calape", "Candijay", "Carmen", "Catigbian", "Clarin", "Corella", "Cortes", "Dagohoy", "Danao", "Dauis", "Dimiao", "Duero", "Garcia Hernandez", "Getafe", "Guindulman", "Inabanga", "Jagna", "Lila", "Loay", "Loboc", "Loon", "Mabini", "Maribojoc", "Panglao", "Pilar", "President Carlos P. Garcia", "Sagbayan", "San Isidro", "San Miguel", "Sevilla", "Sierra Bullones", "Sikatuna", "Talibon", "Trinidad", "Tubigon", "Ubay", "Valencia"],
  "Bukidnon": ["Malaybalay City", "Valencia City", "Baungon", "Cabanglasan", "Damulog", "Dangcagan", "Don Carlos", "Impasugong", "Kadingilan", "Kalilangan", "Kibawe", "Kitaotao", "Lantapan", "Libona", "Malitbog", "Manolo Fortich", "Maramag", "Pangantucan", "Quezon", "San Fernando", "Sumilao", "Talakag"],
  "Bulacan": ["Malolos City", "Meycauayan City", "San Jose del Monte City", "Angat", "Balagtas", "Baliuag", "Bocaue", "Bulakan", "Bustos", "Calumpit", "Doña Remedios Trinidad", "Guiguinto", "Hagonoy", "Marilao", "Norzagaray", "Obando", "Pandi", "Paombong", "Plaridel", "Pulilan", "San Ildefonso", "San Miguel", "San Rafael", "Santa Maria"],
  "Cagayan": ["Tuguegarao City", "Abulug", "Alcala", "Allacapan", "Amulung", "Aparri", "Baggao", "Ballesteros", "Buguey", "Calayan", "Camalaniugan", "Claveria", "Enrile", "Gattaran", "Gonzaga", "Iguig", "Lal-lo", "Lasam", "Pamplona", "Peñablanca", "Piat", "Rizal", "Sanchez-Mira", "Santa Ana", "Santa Praxedes", "Santa Teresita", "Santo Niño", "Solana", "Tuao"],
  "Camarines Norte": ["Daet", "Basud", "Capalonga", "Jose Panganiban", "Labo", "Mercedes", "Paracale", "San Lorenzo Ruiz", "San Vicente", "Santa Elena", "Talisay", "Vinzons"],
  "Camarines Sur": ["Naga City", "Iriga City", "Baao", "Balatan", "Bato", "Bombon", "Buhi", "Bula", "Cabusao", "Calabanga", "Camaligan", "Canaman", "Caramoan", "Del Gallego", "Gainza", "Garchitorena", "Goa", "Lagonoy", "Libmanan", "Lupi", "Magarao", "Milaor", "Minalabac", "Nabua", "Ocampo", "Pamplona", "Pasacao", "Pili", "Presentacion", "Ragay", "Sagñay", "San Fernando", "San Jose", "Sipocot", "Siruma", "Tigaon", "Tinambac"],
  "Camiguin": ["Mambajao", "Catarman", "Guinsiliban", "Mahinog", "Sagay"],
  "Capiz": ["Roxas City", "Cuartero", "Dao", "Dumalag", "Dumarao", "Ivisan", "Jamindan", "Ma-ayon", "Mambusao", "Panay", "Panitan", "Pilar", "Pontevedra", "President Roxas", "Sapian", "Sigma", "Tapaz"],
  "Catanduanes": ["Virac", "Bagamanoc", "Baras", "Bato", "Caramoran", "Gigmoto", "Pandan", "Panganiban", "San Andres", "San Miguel", "Viga"],
  "Cavite": ["Bacoor", "Cavite City", "Dasmariñas", "General Trias", "Imus", "Tagaytay", "Trece Martires", "Alfonso", "Amadeo", "Carmona", "General Emilio Aguinaldo", "General Mariano Alvarez", "Indang", "Kawit", "Magallanes", "Maragondon", "Mendez", "Naic", "Noveleta", "Rosario", "Silang", "Tanza", "Ternate"],
  "Cebu": ["Cebu City", "Lapu-Lapu City", "Mandaue City", "Bogo City", "Carcar City", "Danao City", "Naga City", "Talisay City", "Toledo City", "Alcantara", "Alcoy", "Alegria", "Aloguinsan", "Argao", "Asturias", "Badian", "Balamban", "Bantayan", "Barili", "Boljoon", "Borbon", "Carmen", "Catmon", "Compostela", "Consolacion", "Cordova", "Daanbantayan", "Dalaguete", "Dumanjug", "Ginatilan", "Liloan", "Madridejos", "Malabuyoc", "Medellin", "Minglanilla", "Moalboal", "Oslob", "Pilar", "Pinamungajan", "Poro", "Ronda", "Samboan", "San Fernando", "San Francisco", "San Remigio", "Santa Fe", "Santander", "Sibonga", "Sogod", "Tabogon", "Tabuelan", "Tuburan", "Tudela"],
  "Cotabato": ["Kidapawan City", "Alamada", "Aleosan", "Antipas", "Arakan", "Banisilan", "Carmen", "Kabacan", "Libungan", "M'lang", "Magpet", "Makilala", "Matalam", "Midsayap", "Pigcawayan", "Pikit", "President Roxas", "Tulunan"],
  "Davao de Oro": ["Nabunturan", "Compostela", "Laak", "Mabini", "Maco", "Maragusan", "Mawab", "Monkayo", "Montevista", "New Bataan", "Pantukan"],
  "Davao del Norte": ["Tagum City", "Asuncion", "Braulio E. Dujali", "Carmen", "Kapalong", "New Corella", "Panabo City", "Samal City", "San Isidro", "Santo Tomas", "Talaingod"],
  "Davao del Sur": ["Digos City", "Bansalan", "Hagonoy", "Kiblawan", "Magsaysay", "Malalag", "Matanao", "Padada", "Santa Cruz", "Sulop"],
  "Davao Occidental": ["Malita", "Don Marcelino", "Jose Abad Santos", "Santa Maria", "Sarangani"],
  "Davao Oriental": ["Mati City", "Baganga", "Banaybanay", "Boston", "Caraga", "Cateel", "Governor Generoso", "Lupon", "Manay", "San Isidro", "Tarragona"],
  "Dinagat Islands": ["San Jose", "Basilisa", "Cagdianao", "Dinagat", "Libjo", "Loreto", "Tubajon"],
  "Eastern Samar": ["Borongan City", "Arteche", "Balangiga", "Balangkayan", "Can-avid", "Dolores", "General MacArthur", "Giporlos", "Guiuan", "Hernani", "Jipapad", "Lawaan", "Llorente", "Maslog", "Maydolong", "Mercedes", "Oras", "Quinapondan", "Salcedo", "San Julian", "San Policarpo", "Sulat", "Taft"],
  "Guimaras": ["Jordan", "Buenavista", "Nueva Valencia", "San Lorenzo", "Sibunag"],
  "Ifugao": ["Lagawe", "Aguinaldo", "Alfonso Lista", "Asipulo", "Banaue", "Hingyon", "Hungduan", "Kiangan", "Lamut", "Mayoyao", "Tinoc"],
  "Ilocos Norte": ["Laoag City", "Batac City", "Adams", "Bacarra", "Badoc", "Bangui", "Banna", "Burgos", "Carasi", "Currimao", "Dingras", "Dumalneg", "Marcos", "Nueva Era", "Pagudpud", "Paoay", "Pasuquin", "Piddig", "Pinili", "San Nicolas", "Sarrat", "Solsona", "Vintar"],
  "Ilocos Sur": ["Vigan City", "Candon City", "Alilem", "Banayoyo", "Bantay", "Burgos", "Cabugao", "Caoayan", "Cervantes", "Galimuyod", "Gregorio del Pilar", "Lidlidda", "Magsingal", "Nagbukel", "Narvacan", "Quirino", "Salcedo", "San Emilio", "San Esteban", "San Ildefonso", "San Juan", "San Vicente", "Santa", "Santa Catalina", "Santa Cruz", "Santa Lucia", "Santa Maria", "Santiago", "Santo Domingo", "Sigay", "Sinait", "Sugpon", "Suyo", "Tagudin"],
  "Iloilo": ["Iloilo City", "Passi City", "Ajuy", "Alimodian", "Anilao", "Badiangan", "Balasan", "Banate", "Barotac Nuevo", "Barotac Viejo", "Batad", "Bingawan", "Cabatuan", "Calinog", "Carles", "Concepcion", "Dingle", "Dueñas", "Dumangas", "Estancia", "Guimbal", "Igbaras", "Janiuay", "Lambunao", "Leganes", "Lemery", "Leon", "Maasin", "Miagao", "Mina", "New Lucena", "Oton", "Pavia", "Pototan", "San Dionisio", "San Enrique", "San Joaquin", "San Miguel", "San Rafael", "Santa Barbara", "Sara", "Tigbauan", "Tubungan", "Zarraga"],
  "Isabela": ["Ilagan City", "Cauayan City", "Santiago City", "Alicia", "Angadanan", "Aurora", "Benito Soliven", "Burgos", "Cabagan", "Cabatuan", "Cordon", "Delfin Albano", "Dinapigue", "Divilacan", "Echague", "Gamu", "Jones", "Luna", "Maconacon", "Mallig", "Naguilian", "Palanan", "Quezon", "Quirino", "Ramon", "Reina Mercedes", "Roxas", "San Agustin", "San Guillermo", "San Isidro", "San Manuel", "San Mariano", "San Mateo", "San Pablo", "Santa Maria", "Santo Tomas", "Tumauini"],
  "Kalinga": ["Tabuk City", "Balbalan", "Lubuagan", "Pasil", "Pinukpuk", "Rizal", "Tanudan", "Tinglayan"],
  "La Union": ["San Fernando City", "Agoo", "Aringay", "Bacnotan", "Bagulin", "Balaoan", "Bangar", "Bauang", "Burgos", "Caba", "Luna", "Naguilian", "Pugo", "Rosario", "San Gabriel", "San Juan", "Santo Tomas", "Santol", "Sudipen", "Tubao"],
  "Laguna": ["Calamba City", "San Pablo City", "Biñan City", "Santa Rosa City", "Cabuyao City", "Alaminos", "Bay", "Calauan", "Cavinti", "Famy", "Kalayaan", "Liliw", "Los Baños", "Luisiana", "Lumban", "Mabitac", "Magdalena", "Majayjay", "Nagcarlan", "Paete", "Pagsanjan", "Pakil", "Pangil", "Pila", "Rizal", "San Pedro", "Santa Cruz", "Santa Maria", "Siniloan", "Victoria"],
  "Lanao del Norte": ["Iligan City", "Bacolod", "Baloi", "Baroy", "Kapatagan", "Kauswagan", "Kolambugan", "Lala", "Linamon", "Magsaysay", "Maigo", "Matungao", "Munai", "Nunungan", "Pantao Ragat", "Pantar", "Poona Piagapo", "Salvador", "Sapad", "Sultan Naga Dimaporo", "Tagoloan", "Tangcal", "Tubod"],
  "Lanao del Sur": ["Marawi City", "Bacolod-Kalawi", "Balabagan", "Balindong", "Bayang", "Binidayan", "Buadiposo-Buntong", "Bubong", "Bumbaran", "Butig", "Calanogas", "Ditsaan-Ramain", "Ganassi", "Kapai", "Kapatagan", "Lumba-Bayabao", "Lumbaca-Unayan", "Lumbatan", "Lumbayanague", "Madalum", "Madamba", "Maguing", "Malabang", "Marantao", "Marogong", "Masiu", "Mulondo", "Pagayawan", "Piagapo", "Poona Bayabao", "Pualas", "Saguiaran", "Sultan Dumalondong", "Picong", "Tagoloan II", "Tamparan", "Taraka", "Tubaran", "Tugaya", "Wao"],
  "Leyte": ["Tacloban City", "Ormoc City", "Abuyog", "Alangalang", "Albuera", "Babatngon", "Barugo", "Bato", "Baybay City", "Burauen", "Calubian", "Capoocan", "Carigara", "Dagami", "Dulag", "Hilongos", "Hindang", "Inopacan", "Isabel", "Jaro", "Javier", "Julita", "Kananga", "La Paz", "Leyte", "MacArthur", "Mahaplag", "Matag-ob", "Matalom", "Mayorga", "Merida", "Palo", "Palompon", "Pastrana", "San Isidro", "San Miguel", "Santa Fe", "Tabango", "Tabontabon", "Tanauan", "Tolosa", "Tunga", "Villaba"],
  "Maguindanao": ["Cotabato City", "Ampatuan", "Barira", "Buldon", "Buluan", "Datu Abdullah Sangki", "Datu Anggal Midtimbang", "Datu Blah T. Sinsuat", "Datu Hoffer Ampatuan", "Datu Montawal", "Datu Odin Sinsuat", "Datu Paglas", "Datu Piang", "Datu Salibo", "Datu Saudi-Ampatuan", "Datu Unsay", "Gen. S. K. Pendatun", "Guindulungan", "Kabuntalan", "Mamasapano", "Mangudadatu", "Matanog", "Northern Kabuntalan", "Pagalungan", "Paglat", "Pandag", "Parang", "Rajah Buayan", "Shariff Aguak", "Shariff Saydona Mustapha", "South Upi", "Sultan Kudarat", "Sultan Mastura", "Sultan sa Barongis", "Sultan Sumagka", "Talayan", "Talitay", "Upi"],
  "Marinduque": ["Boac", "Buenavista", "Gasan", "Mogpog", "Santa Cruz", "Torrijos"],
  "Masbate": ["Masbate City", "Aroroy", "Baleno", "Balud", "Batuan", "Cataingan", "Cawayan", "Claveria", "Dimasalang", "Esperanza", "Mandaon", "Milagros", "Mobo", "Monreal", "Palanas", "Pio V. Corpuz", "Placer", "San Fernando", "San Jacinto", "San Pascual", "Uson"],
  "Metro Manila": ["Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Manila", "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay", "Pasig", "Pateros", "Quezon City", "San Juan", "Taguig", "Valenzuela"],
  "Misamis Occidental": ["Oroquieta City", "Ozamiz City", "Tangub City", "Aloran", "Baliangao", "Bonifacio", "Calamba", "Clarin", "Concepcion", "Don Victoriano Chiongbian", "Jimenez", "Lopez Jaena", "Panaon", "Plaridel", "Sapang Dalaga", "Sinacaban", "Tudela"],
  "Misamis Oriental": ["Cagayan de Oro City", "Gingoog City", "Alubijid", "Balingasag", "Balingoan", "Binuangan", "Claveria", "El Salvador", "Gitagum", "Initao", "Jasaan", "Kinoguitan", "Lagonglong", "Laguindingan", "Libertad", "Lugait", "Magsaysay", "Manticao", "Medina", "Naawan", "Opol", "Salay", "Sugbongcogon", "Tagoloan", "Talisayan", "Villanueva"],
  "Mountain Province": ["Bontoc", "Bauko", "Besao", "Barlig", "Natonin", "Paracelis", "Sabangan", "Sadanga", "Sagada", "Tadian"],
  "Negros Occidental": ["Bacolod City", "Bago City", "Cadiz City", "Escalante City", "Himamaylan City", "Kabankalan City", "La Carlota City", "Sagay City", "San Carlos City", "Silay City", "Sipalay City", "Talisay City", "Victorias City", "Binalbagan", "Calatrava", "Candoni", "Cauayan", "Enrique B. Magalona", "Hinigaran", "Hinoba-an", "Ilog", "Isabela", "La Castellana", "Manapla", "Moises Padilla", "Murcia", "Pontevedra", "Pulupandan", "Salvador Benedicto", "San Enrique", "Toboso", "Valladolid"],
  "Negros Oriental": ["Dumaguete City", "Bais City", "Bayawan City", "Canlaon City", "Guihulngan City", "Tanjay City", "Amlan", "Ayungon", "Bacong", "Basay", "Bindoy", "Dauin", "Jimalalud", "La Libertad", "Mabinay", "Manjuyod", "Pamplona", "San Jose", "Santa Catalina", "Siaton", "Sibulan", "Tayasan", "Valencia", "Vallehermoso", "Zamboanguita"],
  "Northern Samar": ["Allen", "Biri", "Bobon", "Capul", "Catarman", "Catubig", "Gamay", "Laoang", "Lapinig", "Las Navas", "Lavezares", "Lope de Vega", "Mapanas", "Mondragon", "Palapag", "Pambujan", "Rosario", "San Antonio", "San Isidro", "San Jose", "San Roque", "San Vicente", "Silvino Lobos", "Victoria"],
  "Nueva Ecija": ["Cabanatuan City", "Gapan City", "Palayan City", "San Jose City", "Science City of Muñoz", "Aliaga", "Bongabon", "Cabiao", "Carranglan", "Cuyapo", "Gabaldon", "General Mamerto Natividad", "General Tinio", "Guimba", "Jaen", "Laur", "Licab", "Llanera", "Lupao", "Nampicuan", "Pantabangan", "Peñaranda", "Quezon", "Rizal", "San Antonio", "San Isidro", "San Leonardo", "Santa Rosa", "Santo Domingo", "Talavera", "Talugtug", "Zaragoza"],
  "Nueva Vizcaya": ["Bayombong", "Alfonso Castaneda", "Ambaguio", "Aritao", "Bagabag", "Bambang", "Diadi", "Dupax del Norte", "Dupax del Sur", "Kasibu", "Kayapa", "Quezon", "Santa Fe", "Solano", "Villaverde"],
  "Occidental Mindoro": ["Mamburao", "Abra de Ilog", "Calintaan", "Looc", "Lubang", "Magsaysay", "Paluan", "Rizal", "Sablayan", "San Jose", "Santa Cruz"],
  "Oriental Mindoro": ["Calapan City", "Baco", "Bansud", "Bongabong", "Bulalacao", "Gloria", "Mansalay", "Naujan", "Pola", "Puerto Galera", "Roxas", "San Teodoro", "Socorro", "Victoria"],
  "Palawan": ["Puerto Princesa City", "Aborlan", "Agutaya", "Araceli", "Balabac", "Bataraza", "Brooke's Point", "Busuanga", "Cagayancillo", "Coron", "Culion", "Cuyo", "Dumaran", "El Nido", "Kalayaan", "Linapacan", "Magsaysay", "Narra", "Quezon", "Rizal", "Roxas", "San Vicente", "Sofronio Española", "Taytay"],
  "Pampanga": ["Angeles City", "San Fernando City", "Apalit", "Arayat", "Bacolor", "Candaba", "Floridablanca", "Guagua", "Lubao", "Mabalacat City", "Macabebe", "Magalang", "Masantol", "Mexico", "Minalin", "Porac", "San Luis", "San Simon", "Santa Ana", "Santa Rita", "Santo Tomas", "Sasmuan"],
  "Pangasinan": ["Alaminos City", "Dagupan City", "San Carlos City", "Urdaneta City", "Agno", "Aguilar", "Alcala", "Anda", "Asingan", "Balungao", "Bani", "Basista", "Bautista", "Bayambang", "Binalonan", "Binmaley", "Bolinao", "Bugallon", "Burgos", "Calasiao", "Dasol", "Infanta", "Labrador", "Laoac", "Lingayen", "Mabini", "Malasiqui", "Manaoag", "Mangaldan", "Mangatarem", "Mapandan", "Natividad", "Pozzorubio", "Rosales", "San Fabian", "San Jacinto", "San Manuel", "San Nicolas", "San Quintin", "Santa Barbara", "Santa Maria", "Santo Tomas", "Sison", "Sual", "Tayug", "Umingan", "Urbiztondo", "Villasis"],
  "Quezon": ["Lucena City", "Tayabas City", "Agdangan", "Alabat", "Atimonan", "Buenavista", "Burdeos", "Calauag", "Candelaria", "Catanauan", "Dolores", "General Luna", "General Nakar", "Guinayangan", "Gumaca", "Infanta", "Jomalig", "Lopez", "Lucban", "Macalelon", "Mauban", "Mulanay", "Padre Burgos", "Pagbilao", "Panukulan", "Patnanungan", "Perez", "Pitogo", "Plaridel", "Polillo", "Quezon", "Real", "Sampaloc", "San Andres", "San Antonio", "San Francisco", "San Narciso", "Sariaya", "Tagkawayan", "Tiaong", "Unisan"],
  "Quirino": ["Cabarroguis", "Aglipay", "Diffun", "Maddela", "Nagtipunan", "Saguday"],
  "Rizal": ["Antipolo City", "Angono", "Baras", "Binangonan", "Cainta", "Cardona", "Jalajala", "Morong", "Pililla", "Rodriguez", "San Mateo", "Tanay", "Taytay", "Teresa"],
  "Romblon": ["Alcantara", "Banton", "Cajidiocan", "Calatrava", "Concepcion", "Corcuera", "Ferrol", "Looc", "Magdiwang", "Odiongan", "Romblon", "San Agustin", "San Andres", "San Fernando", "San Jose", "Santa Fe", "Santa Maria"],
  "Samar": ["Catbalogan City", "Calbayog City", "Almagro", "Basey", "Calbiga", "Daram", "Gandara", "Hinabangan", "Jiabong", "Marabut", "Matuguinao", "Motiong", "Pagsanghan", "Paranas", "Pinabacdao", "San Jorge", "San Jose de Buan", "San Sebastian", "Santa Margarita", "Santa Rita", "Santo Niño", "Tagapul-an", "Talalora", "Tarangnan", "Villareal", "Zumarraga"],
  "Sarangani": ["Alabel", "Glan", "Kiamba", "Maasim", "Maitum", "Malapatan", "Malungon"],
  "Siquijor": ["Siquijor", "Enrique Villanueva", "Larena", "Lazi", "Maria", "San Juan"],
  "Sorsogon": ["Sorsogon City", "Barcelona", "Bulan", "Bulusan", "Casiguran", "Castilla", "Donsol", "Gubat", "Irosin", "Juban", "Magallanes", "Matnog", "Pilar", "Prieto Diaz", "Santa Magdalena"],
  "South Cotabato": ["General Santos City", "Koronadal City", "Banga", "Lake Sebu", "Norala", "Polomolok", "Santo Niño", "Surallah", "Tampakan", "Tantangan", "T'Boli", "Tupi"],
  "Southern Leyte": ["Maasin City", "Anahawan", "Bontoc", "Hinunangan", "Hinundayan", "Libagon", "Liloan", "Limasawa", "Macrohon", "Malitbog", "Padre Burgos", "Pintuyan", "Saint Bernard", "San Francisco", "San Juan", "San Ricardo", "Silago", "Sogod", "Tomas Oppus"],
  "Sultan Kudarat": ["Tacurong City", "Bagumbayan", "Columbio", "Esperanza", "Isulan", "Kalamansig", "Lambayong", "Lebak", "Lutayan", "Palimbang", "President Quirino", "Senator Ninoy Aquino"],
  "Sulu": ["Hadji Panglima Tahil", "Indanan", "Jolo", "Kalingalan Caluang", "Lugus", "Luuk", "Maimbung", "Old Panamao", "Omar", "Pandami", "Panglima Estino", "Pangutaran", "Parang", "Pata", "Patikul", "Siasi", "Talipao", "Tapul", "Tongkil"],
  "Surigao del Norte": ["Surigao City", "Alegria", "Bacuag", "Burgos", "Claver", "Dapa", "Del Carmen", "General Luna", "Gigaquit", "Mainit", "Malimono", "Pilar", "Placer", "San Benito", "San Francisco", "San Isidro", "Santa Monica", "Sison", "Socorro", "Tagana-an", "Tubod"],
  "Surigao del Sur": ["Bislig City", "Tandag City", "Barobo", "Bayabas", "Cagwait", "Cantilan", "Carmen", "Carrascal", "Cortes", "Hinatuan", "Lanuza", "Lianga", "Lingig", "Madrid", "Marihatag", "San Agustin", "San Miguel", "Tagbina", "Tago"],
  "Tarlac": ["Tarlac City", "Anao", "Bamban", "Camiling", "Capas", "Concepcion", "Gerona", "La Paz", "Mayantoc", "Moncada", "Paniqui", "Pura", "Ramos", "San Clemente", "San Jose", "San Manuel", "Santa Ignacia", "Victoria"],
  "Tawi-Tawi": ["Bongao", "Languyan", "Mapun", "Panglima Sugala", "Sapa-Sapa", "Sibutu", "Simunul", "Sitangkai", "South Ubian", "Tandubas", "Turtle Islands"],
  "Zambales": ["Olongapo City", "Botolan", "Cabangan", "Candelaria", "Castillejos", "Iba", "Masinloc", "Palauig", "San Antonio", "San Felipe", "San Marcelino", "San Narciso", "Santa Cruz", "Subic"],
  "Zamboanga del Norte": ["Dapitan City", "Dipolog City", "Bacungan", "Baliguian", "Godod", "Gutalac", "Jose Dalman", "Kalawit", "Katipunan", "La Libertad", "Labason", "Liloy", "Manukan", "Mutia", "Piñan", "Polanco", "President Manuel A. Roxas", "Rizal", "Salug", "Sergio Osmeña Sr.", "Siayan", "Sibuco", "Sibutad", "Sindangan", "Siocon", "Sirawai", "Tampilisan"],
  "Zamboanga del Sur": ["Pagadian City", "Zamboanga City", "Aurora", "Bayog", "Dimataling", "Dinas", "Dumalinao", "Dumingag", "Guipos", "Josefina", "Kumalarang", "Labangan", "Lakewood", "Lapuyan", "Mahayag", "Margosatubig", "Midsalip", "Molave", "Pitogo", "Ramon Magsaysay", "San Miguel", "San Pablo", "Sominot", "Tabina", "Tambulig", "Tigbao", "Tukuran", "Vincenzo A. Sagun"],
  "Zamboanga Sibugay": ["Alicia", "Buug", "Diplahan", "Imelda", "Ipil", "Kabasalan", "Mabuhay", "Malangas", "Naga", "Olutanga", "Payao", "Roseller Lim", "Siay", "Talusan", "Titay", "Tungawan"],
};

// List of all provinces
const PHILIPPINE_PROVINCES = Object.keys(CITIES_BY_PROVINCE);

// List of valid ID types
const VALID_ID_TYPES = [
  "National ID (PhilSys)",
  "Driver's License",
  "Passport",
  "Voter's ID",
  "SSS ID",
  "UMID",
  "Postal ID",
  "PRC ID",
];

// Zod schema for verification form
const verificationSchema = z.object({
  streetPurok: z.string().min(1, "Street/Purok is required"),
  houseNumberUnit: z.string().min(1, "House number/unit is required"),
  region: z.string().min(1, "Region is required"),
  province: z.string().optional(),
  cityMunicipality: z.string().min(1, "City/Municipality is required"),
  postalCode: z.string().min(4, "Postal code is required").max(4, "Postal code must be 4 digits").regex(/^\d+$/, "Postal code must be numeric"),
  barangay: z.string().min(1, "Barangay is required"),
  idType: z.string().min(1, "ID type is required"),
  governmentIdFront: z
    .instanceof(File, { message: "Government ID front is required" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 5MB",
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Only JPEG, PNG files are allowed",
    ),
  governmentIdBack: z
    .instanceof(File, { message: "Government ID back is required" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 5MB",
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Only JPEG, PNG files are allowed",
    ),
  proofOfResidency: z
    .instanceof(File, { message: "Proof of residency is required" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 5MB",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
          file.type,
        ),
      "Only JPEG, PNG, PDF files are allowed",
    ),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

const VerificationPage = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      streetPurok: "",
      houseNumberUnit: "",
      region: "",
      province: "",
      cityMunicipality: "",
      postalCode: "",
      barangay: "",
      idType: "",
    },
  });

  // Watch the region and province fields to update options
  const selectedRegion = form.watch("region");
  const selectedProvince = form.watch("province");
  const selectedCity = form.watch("cityMunicipality");
  
  // Check if NCR is selected
  const isNCR = selectedRegion === "NCR - National Capital Region (Metro Manila)";
  
  // Get provinces for selected region
  const availableProvinces = selectedRegion ? PROVINCES_BY_REGION[selectedRegion] || [] : [];
  
  // For NCR, use Metro Manila cities directly; otherwise use selected province
  const citySource = isNCR ? "Metro Manila" : selectedProvince;
  
  // Get barangays for selected city
  const availableBarangays = selectedCity ? BARANGAYS_BY_CITY[selectedCity] || [] : [];

  const onSubmit = async (data: VerificationFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement verification submission logic
      console.log("Verification submitted:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Drag and drop file upload component
  const DragDropFileUpload = ({
    field,
    label,
    description,
    accept = "image/*",
    onChange,
  }: {
    field: any;
    label: string;
    description: string;
    accept?: string;
    onChange: (file: File | undefined) => void;
  }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          onChange(acceptedFiles[0]);
        }
      },
      accept: accept === "image/*,application/pdf" 
        ? { 'image/*': [], 'application/pdf': [] }
        : { 'image/*': [] },
      maxFiles: 1,
      multiple: false,
    });

    const removeFile = () => {
      onChange(undefined);
    };

    return (
      <div className="space-y-2">
        <FormLabel>{label}</FormLabel>
        <p className="text-sm text-gray-600">{description}</p>

        <div
          {...getRootProps()}
          className={cn(
            "rounded-lg border-2 border-dashed p-4 text-center transition-colors cursor-pointer",
            isDragActive
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 hover:border-gray-400"
          )}
        >
          <input {...getInputProps()} />

          {field.value ? (
            <div className="space-y-2">
              <FileImage className="mx-auto h-8 w-8 text-green-600" />
              <p className="text-sm font-medium text-green-600">
                ✓ {field.value.name}
              </p>
              <p className="text-xs text-gray-500">
                {(field.value.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Upload className="mr-1 h-3 w-3" />
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                >
                  <X className="mr-1 h-3 w-3" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {isDragActive ? (
                <>
                  <Upload className="mx-auto h-8 w-8 text-orange-600 animate-bounce" />
                  <p className="text-sm font-medium text-orange-600">
                    Drop file here...
                  </p>
                </>
              ) : (
                <>
                  <FileImage className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-sm font-medium">
                    Drag and drop file here, or click to select
                  </p>
                  <p className="text-xs text-gray-500">Max size: 5MB</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="flex h-svh flex-col justify-center space-y-6 px-4 lg:px-6">
        <div className="mx-auto flex max-w-2xl">
          <div className="h space-y-4 py-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
            <h3 className="text-xl font-semibold text-green-800">
              Verification Submitted!
            </h3>
            <p className="text-gray-600">
              Your verification request has been submitted successfully. You
              will receive a notification once your account is verified.
            </p>
            <Button onClick={() => navigate("/resident")}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/resident")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <ShieldCheck className="h-8 w-8 text-orange-600" />
            Verify Your Residency
          </h1>
          <p className="mt-2 text-gray-600">
            Complete the verification process to access all barangay services
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verification Form</CardTitle>
            <CardDescription>
              Please provide your address details and upload required documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Address Information</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="houseNumberUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>House Number/Unit *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 123, Apt 4B, Unit 5"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="streetPurok"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street/Purok *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Rizal Street, Purok 1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Region *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Reset province and city when region changes
                              form.setValue("province", "");
                              form.setValue("cityMunicipality", "");
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full max-w-[280px]">
                                <SelectValue placeholder="Select your region" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PHILIPPINE_REGIONS.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Province *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Reset city when province changes
                              form.setValue("cityMunicipality", "");
                            }}
                            defaultValue={field.value}
                            disabled={!selectedRegion || isNCR}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={isNCR ? "Not applicable for NCR" : (selectedRegion ? "Select your province" : "Select region first")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableProvinces.map((province) => (
                                <SelectItem key={province} value={province}>
                                  {province}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="cityMunicipality"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>City/Municipality *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Reset barangay when city changes
                              form.setValue("barangay", "");
                            }}
                            defaultValue={field.value}
                            disabled={!citySource}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full max-w-[280px]">
                                <SelectValue placeholder={citySource ? "Select city/municipality" : (isNCR ? "Select region first" : "Select province first")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {citySource && CITIES_BY_PROVINCE[citySource]?.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="barangay"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Barangay *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!selectedCity || availableBarangays.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={availableBarangays.length > 0 ? "Select barangay" : "No barangay data"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableBarangays.map((barangay) => (
                                <SelectItem key={barangay} value={barangay}>
                                  {barangay}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 4500"
                            maxLength={4}
                            className="max-w-[280px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Document Upload */}
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold">Required Documents</h3>
                  <FormField
                    control={form.control}
                    name="idType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid Government ID *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full max-w-[280px]">
                              <SelectValue placeholder="Select ID type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VALID_ID_TYPES.map((idType) => (
                              <SelectItem key={idType} value={idType}>
                                {idType}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Government ID Front */}
                  <FormField
                    control={form.control}
                    name="governmentIdFront"
                    render={({ field }) => (
                      <FormItem>
                        <DragDropFileUpload
                          field={field}
                          label="Government ID (Front Side)"
                          description="Upload a clear photo of the front side of your valid government ID"
                          accept="image/*"
                          onChange={(file) => field.onChange(file)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Government ID Back */}
                  <FormField
                    control={form.control}
                    name="governmentIdBack"
                    render={({ field }) => (
                      <FormItem>
                        <DragDropFileUpload
                          field={field}
                          label="Government ID (Back Side)"
                          description="Upload a clear photo of the back side of your valid government ID"
                          accept="image/*"
                          onChange={(file) => field.onChange(file)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Proof of Residency */}
                  <FormField
                    control={form.control}
                    name="proofOfResidency"
                    render={({ field }) => (
                      <FormItem>
                        <DragDropFileUpload
                          field={field}
                          label="Proof of Residency"
                          description="Upload any document showing your current address (Utility Bill, Lease Contract, Certificate of Residency, etc.)"
                          accept="image/*,application/pdf"
                          onChange={(file) => field.onChange(file)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Information Note */}
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your verification request will be
                    reviewed by barangay staff. You will receive a notification
                    once your account is verified (usually within 1-3 business
                    days).
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Verification"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPage;
