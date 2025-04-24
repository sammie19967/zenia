import { connectDB } from '@/lib/mongoose';
import County from '@/models/County';
import Subcounty from '@/models/Subcounty';

export async function GET() {
  await connectDB();

  await County.deleteMany();
  await Subcounty.deleteMany();

  const locationData = [{
    "counties": [
      {
        "id": 1,
        "name": "Mombasa",
        "subcounties": [
          {"name": "Changamwe", "towns": ["Port Reitz", "Chaani", "Miritini"]},
          {"name": "Jomvu", "towns": ["Mikindani", "Jomvu Kuu"]},
          {"name": "Kisauni", "towns": ["Mtopanga", "Mkomani", "Bamburi", "Nyali"]},
          {"name": "Likoni", "towns": ["Likoni", "Diani", "Shika Adabu"]},
          {"name": "Mvita", "towns": ["Mombasa Central", "Old Town"]},
          {"name": "Nyali", "towns": ["Kongowea", "Bamburi"]}
        ]
      },
      {
        "id": 2,
        "name": "Kwale",
        "subcounties": [
          {"name": "Kinango", "towns": ["Kinango", "Mackinnon Road"]},
          {"name": "Lungalunga", "towns": ["Lungalunga", "Pongwe"]},
          {"name": "Matuga", "towns": ["Kwale", "Ukunda"]},
          {"name": "Msambweni", "towns": ["Msambweni", "Diani"]}
        ]
      },
      {
        "id": 3,
        "name": "Kilifi",
        "subcounties": [
          {"name": "Ganze", "towns": ["Ganze", "Bamba"]},
          {"name": "Kaloleni", "towns": ["Kaloleni", "Mavueni"]},
          {"name": "Kilifi North", "towns": ["Kilifi", "Mnarani"]},
          {"name": "Kilifi South", "towns": ["Kilifi", "Vipingo"]},
          {"name": "Magarini", "towns": ["Marafa", "Adu"]},
          {"name": "Malindi", "towns": ["Malindi", "Watamu"]},
          {"name": "Rabai", "towns": ["Rabai", "Kambe"]}
        ]
      },
      {
        "id": 4,
        "name": "Tana River",
        "subcounties": [
          {"name": "Bura", "towns": ["Bura", "Hola"]},
          {"name": "Galole", "towns": ["Garsen", "Kipini"]},
          {"name": "Garsen", "towns": ["Garsen", "Kipini"]}
        ]
      },
      {
        "id": 5,
        "name": "Lamu",
        "subcounties": [
          {"name": "Lamu East", "towns": ["Faza", "Kiunga"]},
          {"name": "Lamu West", "towns": ["Lamu", "Mpeketoni"]}
        ]
      },
      {
        "id": 6,
        "name": "Taita-Taveta",
        "subcounties": [
          {"name": "Mwatate", "towns": ["Mwatate", "Bura"]},
          {"name": "Taveta", "towns": ["Taveta", "Lake Jipe"]},
          {"name": "Voi", "towns": ["Voi", "Maungu"]},
          {"name": "Wundanyi", "towns": ["Wundanyi", "Mghange"]}
        ]
      },
      {
        "id": 7,
        "name": "Garissa",
        "subcounties": [
          {"name": "Daadab", "towns": ["Dadaab", "Liboi"]},
          {"name": "Fafi", "towns": ["Bura", "Hola"]},
          {"name": "Garissa Township", "towns": ["Garissa"]},
          {"name": "Hulugho", "towns": ["Hulugho"]},
          {"name": "Ijara", "towns": ["Ijara", "Masalani"]},
          {"name": "Lagdera", "towns": ["Modogashe"]}
        ]
      },
      {
        "id": 8,
        "name": "Wajir",
        "subcounties": [
          {"name": "Eldas", "towns": ["Eldas"]},
          {"name": "Tarbaj", "towns": ["Tarbaj"]},
          {"name": "Wajir East", "towns": ["Wajir"]},
          {"name": "Wajir North", "towns": ["Bute", "Habaswein"]},
          {"name": "Wajir South", "towns": ["Griftu"]},
          {"name": "Wajir West", "towns": ["Wajir"]}
        ]
      },
      {
        "id": 9,
        "name": "Mandera",
        "subcounties": [
          {"name": "Banissa", "towns": ["Banissa"]},
          {"name": "Lafey", "towns": ["Lafey"]},
          {"name": "Mandera East", "towns": ["Mandera"]},
          {"name": "Mandera North", "towns": ["Takaba"]},
          {"name": "Mandera South", "towns": ["El Wak"]},
          {"name": "Mandera West", "towns": ["Mandera"]}
        ]
      },
      {
        "id": 10,
        "name": "Marsabit",
        "subcounties": [
          {"name": "Laisamis", "towns": ["Laisamis"]},
          {"name": "Moyale", "towns": ["Moyale"]},
          {"name": "North Horr", "towns": ["North Horr"]},
          {"name": "Saku", "towns": ["Marsabit"]}
        ]
      },
      {
        "id": 11,
        "name": "Isiolo",
        "subcounties": [
          {"name": "Isiolo", "towns": ["Isiolo"]},
          {"name": "Merti", "towns": ["Merti"]},
          {"name": "Garbatulla", "towns": ["Garbatulla"]}
        ]
      },
      {
        "id": 12,
        "name": "Meru",
        "subcounties": [
          {"name": "Buuri", "towns": ["Timau", "Makutano"]},
          {"name": "Imenti Central", "towns": ["Nkubu", "Mitunguu"]},
          {"name": "Imenti North", "towns": ["Meru", "Maua"]},
          {"name": "Imenti South", "towns": ["Mitunguu", "Nkubu"]},
          {"name": "Igembe Central", "towns": ["Kangeta", "Maua"]},
          {"name": "Igembe North", "towns": ["Laare", "Maua"]},
          {"name": "Igembe South", "towns": ["Athiru Gaiti", "Maua"]},
          {"name": "Tigania East", "towns": ["Muthara", "Maua"]},
          {"name": "Tigania West", "towns": ["Mikinduri", "Maua"]}
        ]
      },
      {
        "id": 13,
        "name": "Tharaka-Nithi",
        "subcounties": [
          {"name": "Chuka", "towns": ["Chuka", "Igoji"]},
          {"name": "Maara", "towns": ["Chogoria", "Marimanti"]},
          {"name": "Tharaka", "towns": ["Marimanti", "Gatunga"]}
        ]
      },
      {
        "id": 14,
        "name": "Embu",
        "subcounties": [
          {"name": "Embu East", "towns": ["Runyenjes", "Siakago"]},
          {"name": "Embu North", "towns": ["Manyatta", "Embu"]},
          {"name": "Embu West", "towns": ["Embu", "Runyenjes"]},
          {"name": "Mbeere North", "towns": ["Siakago", "Island"]},
          {"name": "Mbeere South", "towns": ["Kiritiri", "Makima"]}
        ]
      },
      {
        "id": 15,
        "name": "Kitui",
        "subcounties": [
          {"name": "Kitui Central", "towns": ["Kitui", "Mutonguni"]},
          {"name": "Kitui East", "towns": ["Mutomo", "Ikutha"]},
          {"name": "Kitui Rural", "towns": ["Kitui", "Kabati"]},
          {"name": "Kitui South", "towns": ["Mutomo", "Ikutha"]},
          {"name": "Kitui West", "towns": ["Mwingi", "Tseikuru"]},
          {"name": "Mwingi Central", "towns": ["Mwingi", "Kyuso"]},
          {"name": "Mwingi North", "towns": ["Garissa", "Hola"]},
          {"name": "Mwingi West", "towns": ["Mwingi", "Tseikuru"]}
        ]
      },
      {
        "id": 16,
        "name": "Machakos",
        "subcounties": [
          {"name": "Kathiani", "towns": ["Kathiani", "Mitaboni"]},
          {"name": "Machakos Town", "towns": ["Machakos", "Muthini"]},
          {"name": "Masinga", "towns": ["Masinga", "Ndalani"]},
          {"name": "Matungulu", "towns": ["Tala", "Matungulu"]},
          {"name": "Mwala", "towns": ["Mwala", "Masii"]},
          {"name": "Yatta", "towns": ["Kithimani", "Matuu"]}
        ]
      },
      {
        "id": 17,
        "name": "Makueni",
        "subcounties": [
          {"name": "Kaiti", "towns": ["Wote", "Kathonzweni"]},
          {"name": "Kibwezi East", "towns": ["Kibwezi", "Mtito Andei"]},
          {"name": "Kibwezi West", "towns": ["Kibwezi", "Mtito Andei"]},
          {"name": "Kilome", "towns": ["Kilome", "Kee"]},
          {"name": "Makueni", "towns": ["Wote", "Kathonzweni"]},
          {"name": "Mbooni", "towns": ["Mbooni", "Kathonzweni"]}
        ]
      },
      {
        "id": 18,
        "name": "Nyandarua",
        "subcounties": [
          {"name": "Kinangop", "towns": ["Engineer", "Njabini"]},
          {"name": "Kipipiri", "towns": ["Kipipiri", "Githioro"]},
          {"name": "Ndaragwa", "towns": ["Ndaragwa", "Leshau"]},
          {"name": "Ol Kalou", "towns": ["Ol Kalou", "Kinangop"]},
          {"name": "Ol Jorok", "towns": ["Ol Jorok", "Njabini"]}
        ]
      },
      {
        "id": 19,
        "name": "Nyeri",
        "subcounties": [
          {"name": "Kieni East", "towns": ["Karatina", "Endarasha"]},
          {"name": "Kieni West", "towns": ["Naro Moru", "Endarasha"]},
          {"name": "Mathira East", "towns": ["Karati", "Karatina"]},
          {"name": "Mathira West", "towns": ["Karatina", "Endarasha"]},
          {"name": "Mukurweini", "towns": ["Mukurweini", "Gakindu"]},
          {"name": "Nyeri Central", "towns": ["Nyeri", "Ruring'u"]},
          {"name": "Nyeri South", "towns": ["Othaya", "Chinga"]},
          {"name": "Tetu", "towns": ["Nyeri", "Ruring'u"]}
        ]
      },
      {
        "id": 20,
        "name": "Kirinyaga",
        "subcounties": [
          {"name": "Kirinyaga Central", "towns": ["Kerugoya", "Kagio"]},
          {"name": "Kirinyaga East", "towns": ["Kianyaga", "Baricho"]},
          {"name": "Kirinyaga West", "towns": ["Wanguru", "Sagana"]},
          {"name": "Mwea East", "towns": ["Wanguru", "Sagana"]},
          {"name": "Mwea West", "towns": ["Wanguru", "Sagana"]}
        ]
      },
      {
        "id": 21,
        "name": "Murang'a",
        "subcounties": [
          {"name": "Gatanga", "towns": ["Gatanga", "Gatanga"]},
          {"name": "Kahuro", "towns": ["Kahuro", "Mugoiri"]},
          {"name": "Kandara", "towns": ["Kandara", "Murang'a"]},
          {"name": "Kangema", "towns": ["Kangema", "Kiriaini"]},
          {"name": "Kigumo", "towns": ["Kigumo", "Kangari"]},
          {"name": "Mathioya", "towns": ["Kiria-ini", "Kangari"]},
          {"name": "Murang'a East", "towns": ["Murang'a", "Kenol"]},
          {"name": "Murang'a South", "towns": ["Murang'a", "Kenol"]}
        ]
      },
      {
        "id": 22,
        "name": "Kiambu",
        "subcounties": [
          {"name": "Gatundu North", "towns": ["Gatundu", "Kamwangi"]},
          {"name": "Gatundu South", "towns": ["Gatundu", "Kamwangi"]},
          {"name": "Githunguri", "towns": ["Githunguri", "Kambaa"]},
          {"name": "Juja", "towns": ["Juja", "Thika"]},
          {"name": "Kabete", "towns": ["Kikuyu", "Uthiru"]},
          {"name": "Kiambaa", "towns": ["Kiambu", "Karuri"]},
          {"name": "Kiambu", "towns": ["Kiambu", "Karuri"]},
          {"name": "Kikuyu", "towns": ["Kikuyu", "Uthiru"]},
          {"name": "Limuru", "towns": ["Limuru", "Tigoni"]},
          {"name": "Lari", "towns": ["Lari", "Kijabe"]},
          {"name": "Ruiru", "towns": ["Ruiru", "Kahawa Sukari"]},
          {"name": "Thika Town", "towns": ["Thika", "Gatuanyaga"]}
        ]
      },
      {
        "id": 23,
        "name": "Turkana",
        "subcounties": [
          {"name": "Loima", "towns": ["Lokiriama", "Lorengippi"]},
          {"name": "Turkana Central", "towns": ["Lodwar", "Kanamkemer"]},
          {"name": "Turkana East", "towns": ["Lokori", "Kapedo"]},
          {"name": "Turkana North", "towns": ["Kakuma", "Lokichoggio"]},
          {"name": "Turkana South", "towns": ["Lokichar", "Kalokol"]},
          {"name": "Turkana West", "towns": ["Kakuma", "Lokichoggio"]}
        ]
      },
      {
        "id": 24,
        "name": "West Pokot",
        "subcounties": [
          {"name": "Central Pokot", "towns": ["Kapenguria", "Makutano"]},
          {"name": "North Pokot", "towns": ["Kacheliba", "Alale"]},
          {"name": "Pokot South", "towns": ["Sigor", "Kacheliba"]},
          {"name": "West Pokot", "towns": ["Kapenguria", "Makutano"]}
        ]
      },
      {
        "id": 25,
        "name": "Samburu",
        "subcounties": [
          {"name": "Samburu East", "towns": ["Wamba", "Waso"]},
          {"name": "Samburu North", "towns": ["Baragoi", "South Horr"]},
          {"name": "Samburu West", "towns": ["Maralal", "Suguta Marmar"]}
        ]
      },
      {
        "id": 26,
        "name": "Trans-Nzoia",
        "subcounties": [
          {"name": "Cherangany", "towns": ["Kitale", "Matunda"]},
          {"name": "Endebess", "towns": ["Endebess", "Suwerwa"]},
          {"name": "Kiminini", "towns": ["Kiminini", "Waitaluk"]},
          {"name": "Kwanza", "towns": ["Kwanza", "Matunda"]},
          {"name": "Saboti", "towns": ["Kitale", "Matunda"]}
        ]
      },
      {
        "id": 27,
        "name": "Uasin Gishu",
        "subcounties": [
          {"name": "Ainabkoi", "towns": ["Eldoret", "Kapsabet"]},
          {"name": "Kapseret", "towns": ["Eldoret", "Kapsabet"]},
          {"name": "Kesses", "towns": ["Eldoret", "Kapsabet"]},
          {"name": "Moiben", "towns": ["Eldoret", "Kapsabet"]},
          {"name": "Soy", "towns": ["Eldoret", "Kapsabet"]},
          {"name": "Turbo", "towns": ["Eldoret", "Kapsabet"]}
        ]
      },
      {
        "id": 28,
        "name": "Elgeyo-Marakwet",
        "subcounties": [
          {"name": "Keiyo North", "towns": ["Iten", "Tambach"]},
          {"name": "Keiyo South", "towns": ["Iten", "Tambach"]},
          {"name": "Marakwet East", "towns": ["Chesoi", "Kapyego"]},
          {"name": "Marakwet West", "towns": ["Chesoi", "Kapyego"]}
        ]
      },
      {
        "id": 29,
        "name": "Nandi",
        "subcounties": [
          {"name": "Chesumei", "towns": ["Eldoret", "Kapsabet"]},
          {"name": "Emgwen", "towns": ["Eldoret", "Kapsabet"]},
          {"name": "Mosop", "towns": ["Eldoret", "Kapsabet"]},
          {"name": "Nandi Hills", "towns": ["Nandi Hills", "Kapsabet"]},
          {"name": "Tinderet", "towns": ["Nandi Hills", "Kapsabet"]}
        ]
      },
      {
        "id": 30,
        "name": "Baringo",
        "subcounties": [
          {"name": "Baringo Central", "towns": ["Kabarnet", "Eldama Ravine"]},
          {"name": "Baringo North", "towns": ["Kabartonjo", "Marigat"]},
          {"name": "Baringo South", "towns": ["Eldama Ravine", "Mogotio"]},
          {"name": "Eldama Ravine", "towns": ["Eldama Ravine", "Mogotio"]},
          {"name": "Mogotio", "towns": ["Mogotio", "Emining"]},
          {"name": "Tiaty", "towns": ["Chemolingot", "Churo"]}
        ]
      },
      {
        "id": 31,
        "name": "Laikipia",
        "subcounties": [
          {"name": "Laikipia Central", "towns": ["Nanyuki", "Rumuruti"]},
          {"name": "Laikipia East", "towns": ["Nanyuki", "Rumuruti"]},
          {"name": "Laikipia North", "towns": ["Nanyuki", "Rumuruti"]},
          {"name": "Laikipia West", "towns": ["Nanyuki", "Rumuruti"]},
          {"name": "Nyahururu", "towns": ["Nyahururu", "Rumuruti"]}
        ]
      },
      {
        "id": 32,
        "name": "Nakuru",
        "subcounties": [
          {"name": "Bahati", "towns": ["Nakuru", "Dundori"]},
          {"name": "Gilgil", "towns": ["Gilgil", "Elementaita"]},
          {"name": "Kuresoi North", "towns": ["Kuresoi", "Molo"]},
          {"name": "Kuresoi South", "towns": ["Kuresoi", "Molo"]},
          {"name": "Molo", "towns": ["Molo", "Elburgon"]},
          {"name": "Naivasha", "towns": ["Naivasha", "Gilgil"]},
          {"name": "Nakuru East", "towns": ["Nakuru", "Bahati"]},
          {"name": "Nakuru West", "towns": ["Nakuru", "Bahati"]},
          {"name": "Njoro", "towns": ["Njoro", "Mau Narok"]},
          {"name": "Rongai", "towns": ["Rongai", "Solai"]},
          {"name": "Subukia", "towns": ["Subukia", "Kabazi"]}
        ]
      },
      {
        "id": 33,
        "name": "Narok",
        "subcounties": [
          {"name": "Narok East", "towns": ["Narok", "Ololulunga"]},
          {"name": "Narok North", "towns": ["Narok", "Ololulunga"]},
          {"name": "Narok South", "towns": ["Narok", "Ololulunga"]},
          {"name": "Narok West", "towns": ["Narok", "Ololulunga"]},
          {"name": "Transmara East", "towns": ["Kilgoris", "Lolgorien"]},
          {"name": "Transmara West", "towns": ["Kilgoris", "Lolgorien"]}
        ]
      },
      {
        "id": 34,
        "name": "Kajiado",
        "subcounties": [
          {"name": "Isinya", "towns": ["Isinya", "Kiserian"]},
          {"name": "Kajiado Central", "towns": ["Kajiado", "Oloitokitok"]},
          {"name": "Kajiado East", "towns": ["Kajiado", "Oloitokitok"]},
          {"name": "Kajiado North", "towns": ["Ngong", "Kiserian"]},
          {"name": "Kajiado South", "towns": ["Kajiado", "Oloitokitok"]},
          {"name": "Kajiado West", "towns": ["Kajiado", "Oloitokitok"]},
          {"name": "Loitokitok", "towns": ["Loitokitok", "Kimana"]},
          {"name": "Mashuuru", "towns": ["Mashuuru", "Sultan Hamud"]}
        ]
      },
      {
        "id": 35,
        "name": "Kericho",
        "subcounties": [
          {"name": "Ainamoi", "towns": ["Kericho", "Litein"]},
          {"name": "Belgut", "towns": ["Belgut", "Litein"]},
          {"name": "Bureti", "towns": ["Litein", "Sotik"]},
          {"name": "Kipkelion East", "towns": ["Kipkelion", "Londiani"]},
          {"name": "Kipkelion West", "towns": ["Kipkelion", "Londiani"]},
          {"name": "Soin/Sigowet", "towns": ["Sigowet", "Soin"]}
        ]
      },
      {
        "id": 36,
        "name": "Bomet",
        "subcounties": [
          {"name": "Bomet Central", "towns": ["Bomet", "Chepalungu"]},
          {"name": "Bomet East", "towns": ["Bomet", "Chepalungu"]},
          {"name": "Chepalungu", "towns": ["Chepalungu", "Sotik"]},
          {"name": "Konoin", "towns": ["Konoin", "Sotik"]},
          {"name": "Sotik", "towns": ["Sotik", "Chepalungu"]}
        ]
      },
      {
        "id": 37,
        "name": "Kakamega",
        "subcounties": [
          {"name": "Butere", "towns": ["Butere", "Mumias"]},
          {"name": "Kakamega Central", "towns": ["Kakamega", "Lurambi"]},
          {"name": "Kakamega East", "towns": ["Kakamega", "Lurambi"]},
          {"name": "Kakamega North", "towns": ["Malava", "Matungu"]},
          {"name": "Kakamega South", "towns": ["Kakamega", "Lurambi"]},
          {"name": "Khwisero", "towns": ["Khwisero", "Butere"]},
          {"name": "Lugari", "towns": ["Lugari", "Matunda"]},
          {"name": "Lukuyani", "towns": ["Lukuyani", "Matungu"]},
          {"name": "Lurambi", "towns": ["Lurambi", "Kakamega"]},
          {"name": "Matungu", "towns": ["Matungu", "Mumias"]},
          {"name": "Mumias East", "towns": ["Mumias", "Butere"]},
          {"name": "Mumias West", "towns": ["Mumias", "Butere"]},
          {"name": "Navakholo", "towns": ["Navakholo", "Kakamega"]}
        ]
      },
      {
        "id": 38,
        "name": "Vihiga",
        "subcounties": [
          {"name": "Emuhaya", "towns": ["Luanda", "Mbale"]},
          {"name": "Hamisi", "towns": ["Hamisi", "Chavakali"]},
          {"name": "Luanda", "towns": ["Luanda", "Mbale"]},
          {"name": "Sabatia", "towns": ["Vihiga", "Majengo"]},
          {"name": "Vihiga", "towns": ["Vihiga", "Majengo"]}
        ]
      },
      {
        "id": 39,
        "name": "Bungoma",
        "subcounties": [
          {"name": "Bumula", "towns": ["Bumula", "Webuye"]},
          {"name": "Kabuchai", "towns": ["Chwele", "Bungoma"]},
          {"name": "Kanduyi", "towns": ["Bungoma", "Webuye"]},
          {"name": "Kimilili", "towns": ["Kimilili", "Bungoma"]},
          {"name": "Mt Elgon", "towns": ["Mt Elgon", "Bungoma"]},
          {"name": "Sirisia", "towns": ["Sirisia", "Bungoma"]},
          {"name": "Tongaren", "towns": ["Tongaren", "Bungoma"]},
          {"name": "Webuye East", "towns": ["Webuye", "Bungoma"]},
          {"name": "Webuye West", "towns": ["Webuye", "Bungoma"]}
        ]
      },
      {
        "id": 40,
        "name": "Busia",
        "subcounties": [
          {"name": "Bunyala", "towns": ["Port Victoria", "Busia"]},
          {"name": "Busia", "towns": ["Busia", "Malaba"]},
          {"name": "Butula", "towns": ["Butula", "Busia"]},
          {"name": "Nambale", "towns": ["Nambale", "Busia"]},
          {"name": "Samia", "towns": ["Funyula", "Busia"]},
          {"name": "Teso North", "towns": ["Amagoro", "Malaba"]},
          {"name": "Teso South", "towns": ["Amagoro", "Malaba"]}
        ]
      },
      {
        "id": 41,
        "name": "Siaya",
        "subcounties": [
          {"name": "Alego Usonga", "towns": ["Siaya", "Ugunja"]},
          {"name": "Bondo", "towns": ["Bondo", "Ugunja"]},
          {"name": "Gem", "towns": ["Yala", "Ugunja"]},
          {"name": "Rarieda", "towns": ["Madiany", "Ugunja"]},
          {"name": "Ugenya", "towns": ["Ugunja", "Siaya"]},
          {"name": "Unguja", "towns": ["Ugunja", "Siaya"]}
        ]
      },
      {
        "id": 42,
        "name": "Kisumu",
        "subcounties": [
          {"name": "Kisumu Central", "towns": ["Kisumu", "Kondele"]},
          {"name": "Kisumu East", "towns": ["Kisumu", "Kondele"]},
          {"name": "Kisumu West", "towns": ["Kisumu", "Kondele"]},
          {"name": "Muhoroni", "towns": ["Muhoroni", "Chemelil"]},
          {"name": "Nyakach", "towns": ["Pap Onditi", "Ahero"]},
          {"name": "Nyando", "towns": ["Ahero", "Awasi"]},
          {"name": "Seme", "towns": ["Seme", "Kisumu"]}
        ]
      },
      {
        "id": 43,
        "name": "Homa Bay",
        "subcounties": [
          {"name": "Homa Bay Town", "towns": ["Homa Bay", "Kendu Bay"]},
          {"name": "Kabondo Kasipul", "towns": ["Oyugis", "Kendu Bay"]},
          {"name": "Karachuonyo", "towns": ["Kendu Bay", "Homa Bay"]},
          {"name": "Kasipul", "towns": ["Oyugis", "Kendu Bay"]},
          {"name": "Mbita", "towns": ["Mbita", "Homa Bay"]},
          {"name": "Ndhiwa", "towns": ["Ndhiwa", "Homa Bay"]},
          {"name": "Rangwe", "towns": ["Rangwe", "Homa Bay"]},
          {"name": "Suba", "towns": ["Mbita", "Homa Bay"]}
        ]
      },
      {
        "id": 44,
        "name": "Migori",
        "subcounties": [
          {"name": "Awendo", "towns": ["Awendo", "Migori"]},
          {"name": "Kuria East", "towns": ["Kehancha", "Migori"]},
          {"name": "Kuria West", "towns": ["Kehancha", "Migori"]},
          {"name": "Mabera", "towns": ["Mabera", "Migori"]},
          {"name": "Ntimaru", "towns": ["Ntimaru", "Migori"]},
          {"name": "Rongo", "towns": ["Rongo", "Migori"]},
          {"name": "Suna East", "towns": ["Migori", "Suna"]},
          {"name": "Suna West", "towns": ["Migori", "Suna"]},
          {"name": "Uriri", "towns": ["Uriri", "Migori"]}
        ]
      },
      {
        "id": 45,
        "name": "Kisii",
        "subcounties": [
          {"name": "Bobasi", "towns": ["Bobasi", "Kisii"]},
          {"name": "Bomachoge Borabu", "towns": ["Bomachoge", "Kisii"]},
          {"name": "Bomachoge Chache", "towns": ["Bomachoge", "Kisii"]},
          {"name": "Bonchari", "towns": ["Bonchari", "Kisii"]},
          {"name": "Kitutu Chache North", "towns": ["Kisii", "Ogembo"]},
          {"name": "Kitutu Chache South", "towns": ["Kisii", "Ogembo"]},
          {"name": "Nyaribari Chache", "towns": ["Kisii", "Ogembo"]},
          {"name": "Nyaribari Masaba", "towns": ["Kisii", "Ogembo"]},
          {"name": "South Mugirango", "towns": ["Nyamarambe", "Kisii"]}
        ]
      },
      {
        "id": 46,
        "name": "Nyamira",
        "subcounties": [
          {"name": "Borabu", "towns": ["Nyamira", "Keroka"]},
          {"name": "Manga", "towns": ["Nyamira", "Keroka"]},
          {"name": "Masaba North", "towns": ["Nyamira", "Keroka"]},
          {"name": "Nyamira North", "towns": ["Nyamira", "Keroka"]},
          {"name": "Nyamira South", "towns": ["Nyamira", "Keroka"]}
        ]
      },
      {
        "id": 47,
        "name": "Nairobi",
        "subcounties": [
          {"name": "Dagoretti North", "towns": ["Kawangware", "Uthiru"]},
          {"name": "Dagoretti South", "towns": ["Kawangware", "Uthiru"]},
          {"name": "Embakasi Central", "towns": ["Embakasi", "Kayole"]},
          {"name": "Embakasi East", "towns": ["Embakasi", "Kayole"]},
          {"name": "Embakasi North", "towns": ["Embakasi", "Kayole"]},
          {"name": "Embakasi South", "towns": ["Embakasi", "Kayole"]},
          {"name": "Embakasi West", "towns": ["Embakasi", "Kayole"]},
          {"name": "Kamukunji", "towns": ["Eastleigh", "Pumwani"]},
          {"name": "Kasarani", "towns": ["Kasarani", "Ruai"]},
          {"name": "Kibra", "towns": ["Kibera", "Laini Saba"]},
          {"name": "Lang'ata", "towns": ["Lang'ata", "Karen"]},
          {"name": "Makadara", "towns": ["Makadara", "Maringo"]},
          {"name": "Mathare", "towns": ["Mathare", "Huruma"]},
          {"name": "Roysambu", "towns": ["Roysambu", "Garden Estate"]},
          {"name": "Ruaraka", "towns": ["Ruaraka", "Baba Dogo"]},
          {"name": "Starehe", "towns": ["Starehe", "Ngara"]},
          {"name": "Westlands", "towns": ["Westlands", "Parklands"]}
        ]
      }
    ]
  }];

  for (const countyData of locationData) {
    const county = await County.create({ name: countyData.name });

    for (const sub of countyData.subcounties) {
      await Subcounty.create({ name: sub, countyId: county._id });
    }
  }

  return Response.json({ message: 'Seeded counties and subcounties ✅' });
}
