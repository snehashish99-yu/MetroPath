// Station order per line is read from the supplied Kolkata Metro map (assets/kolkata-metro-map.png).
// VERIFIED (from map): station names, order on each line, interchanges.
// ESTIMATED: mins/km per hop (one average value per line) and COORDS (approximate lat/lng).
// No live train data is used anywhere in this app.
const LINES = {
  blue:   { name: "Blue Line",   color: "#1f2a8a", mins: 2.2, km: 1.3, stations: ["Dakshineswar","Baranagar","Noapara","Dum Dum","Belgachia","Shyambazar","Shobhabazar Sutanuti","Girish Park","Mahatma Gandhi Road","Central","Chandni Chowk","Esplanade","Park Street","Maidan","Rabindra Sadan","Netaji Bhavan","Jatin Das Park","Kalighat","Rabindra Sarobar","Mahanayak Uttam Kumar","Netaji","Masterda Surya Sen","Kavi Nazrul","Gitanjali","Shahid Khudiram","Kavi Subhash"] },
  green:  { name: "Green Line",  color: "#1f7a2e", mins: 2.5, km: 1.4, stations: ["Howrah Maidan","Howrah","Mahakaran","Esplanade","Sealdah","Phoolbagan","Salt Lake Stadium","Bengal Chemical","City Centre","Central Park","Karunamoyee","Sector V","Keshtopur","Dum Dum Park","Baguiati","Raghunathpur","Teghoria","Biman Bandar"] },
  purple: { name: "Purple Line", color: "#7b2cbf", mins: 2.3, km: 1.2, stations: ["Diamond Park","IIM","Joka","Thakurpukur","Sakherbazar","Behala Chowrasta","Behala Bazar","Taratala","Majerhat","Mominpur","Kidderpore","Victoria","Esplanade"] },
  orange: { name: "Orange Line", color: "#f08a1c", mins: 2.4, km: 1.5, stations: ["Rabindra Tirtha","Titumir","Sub CBD 2","Convention Centre","New Town","Kalakhetra","CBD 1","Sub CBD 1","Bidhan Nagar","Technopolis","Sector V","Nicco Park","Gour Kishor Ghosh","Beliaghata","Barun Sengupta","Ritwik Ghatak","VIP Bazar","Hemanta Mukhopadhyay","Jyotirindra Nandi","Kavi Sukanta","Satyajit Ray","Kavi Subhash"] },
  yellow: { name: "Yellow Line", color: "#e9b800", mins: 2.4, km: 1.8, stations: ["Noapara","Dum Dum Cantonment","Jessore Road","Biman Bandar","Birati","Michael Nagar","New Barrackpore","Madhyamgram","Barasat","Hridaypur"] },
  pink:   { name: "Pink Line",   color: "#e85d9f", mins: 2.3, km: 1.6, stations: ["Barrackpore","Talpukur","Titagarh","Tata Gate","Khardaha","Subhash Nagar","Panihati","Sodepur","Agarpara","Kamarhati","Baranagar"] }
};
// ESTIMATED approximate coordinates (subset). Stations without an entry are skipped by "Find Nearby Metro".
const COORDS = {
  "Dakshineswar":[22.655,88.357],"Baranagar":[22.645,88.377],"Noapara":[22.623,88.398],"Dum Dum":[22.624,88.393],
  "Shyambazar":[22.601,88.374],"Girish Park":[22.584,88.364],"Esplanade":[22.565,88.351],"Park Street":[22.554,88.351],
  "Netaji Bhavan":[22.530,88.347],"Kalighat":[22.520,88.347],"Rabindra Sarobar":[22.513,88.345],"Kavi Subhash":[22.464,88.392],
  "Howrah":[22.585,88.343],"Sealdah":[22.567,88.370],"Salt Lake Stadium":[22.571,88.405],"Central Park":[22.585,88.417],
  "Karunamoyee":[22.577,88.421],"Sector V":[22.570,88.431],"Biman Bandar":[22.642,88.443],"Victoria":[22.545,88.343],
  "Kidderpore":[22.539,88.323],"Majerhat":[22.523,88.320],"Joka":[22.401,88.311],"Barasat":[22.726,88.480],"Technopolis":[22.565,88.438]
};
