var express = require('express'),
morgan = require('morgan'),
request = require('sync-request'),
bodyParser = require('body-parser'),
methodOverride = require('method-override'),
async = require('async'),
app = express(),
port = process.env.PORT || 3000,
router = express.Router(),
unirest = require('unirest');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/stupid%20server';

var insertPlaces = function(db, callback) {
  var collection = db.collection('places');
  collection.insertMany([
    {name: "", like: 0, }
  ], function(err, result) {
    callback(result);
  });
}

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected succesfully to server");



  db.close();
});

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser()); // pull information from html in POST
app.use(methodOverride()); // simulate DELETE and PUT

var info = new Map();
var desc = new Map();

fillDesc();

function fillDesc() {

    desc.set("Butler Library", { short: "Butler Library is Columbia's main library for undergraduate study and graduate research.", long: "Butler Library is Columbia's main library for undergraduate study and graduate research. It is named for longtime University President Nicholas Murray Butler, and holds 2 million volumes in the humanities. Butler has study rooms open 24 hours a day during the school year. Students in Butler tend to either work or spend time on Boredatbutler.com. Among its many facilities, Butler has a Blue Java outlet, a lounge (often used by students working on group assignments), and several computer labs." });
    desc.set("Barnard Hall", { short: "Barnard Hall, originally known as Students Hall, is one of the older buildings on the campus of Barnard College and remains its campus' architectural focal point and administrative center.", long: "Barnard Hall, originally known as Students Hall, is one of the older buildings on the campus of Barnard College and remains its campus' architectural focal point and administrative center, thanks in large part to its location directly opposite the campus gates on Broadway. Its design is very similar to the McKim, Mead, and White classroom buildings on Columbia's campus across the street, and it and the Barnard gates line up with the east-west axis of the Columbia campus through Earl Hall, Low Library, and St. Paul's Chapel. Nevertheless, it was actually designed by Arnold W. Brunner. It was built between 1916 and 1917." });
    desc.set("Columbia University Music Library", { short: "The Gabe M. Weiner Music and Arts Library is a nicely renovated library near the top of Dodge Hall with music books, music scores, sound recordings, and videos.", long: "The Gabe M. Weiner Music and Arts Library is a nicely renovated library near the top of Dodge Hall with music books, music scores, sound recordings, and videos. Most printed materials can be taken out on semester loan, and sound and video recordings circulate to full-time Columbia students, staff, and faculty for 2 weeks. It also has great views of campus. The library features a music computer lab and facilities for listening to sound recordings of all eras." });
    desc.set("C.V. Starr East Asian Library", { short: "The C.V. Starr East Asian Library is located at 300 Kent Hall, directly across from the campus level entrance to Kent.", long: "The C.V. Starr East Asian Library is located at 300 Kent Hall, directly across from the campus level entrance to Kent. It is occasionally known as the East Asian Library or simply the Kent Library. The library houses one of the largest collections of East Asian literature and reference materials in the United States. It currently holds in excess of 810,000 volumes of Chinese, Japanese, Korean, Tibetan, Mongol, Manchu, and Western-language materials and over 6,600 periodical titles, and more than 55 newspapers." });
    desc.set("Arthur W. Diamond Law Library", { short: "The Arthur W. Diamond Law Library, located in Jerome Greene Hall, holds over one million volumes, including books, serials, and microforms. 200+ computers or LAN jacks and several wireless nodes.", long: "The Arthur W. Diamond Law Library, located in Jerome Greene Hall, holds over one million volumes, including books, serials, and microforms. 200+ computers or LAN jacks and several wireless nodes. The Law School has its own IT department and its own network. Only law students can log into computer stations in the school or connect to the school's wireless network. Sucks for undergrads. Only Law School students are allowed into the Reserve reading section, but undergrads can swipe into the library and find a seat either one floor above or below the main entrance during most of the year except exam time, when the entire library is open only to Law students." });
    desc.set("Avery Architectural and Fine Arts Library", { short: "The Avery Architectural and Fine Arts Library, located in Avery Hall, collects books and periodicals in architecture, historic preservation, art history, painting, sculpture, graphic arts, decorative arts, city planning, real estate, and archaeology.", long: "The Avery Architectural and Fine Arts Library, located in Avery Hall, collects books and periodicals in architecture, historic preservation, art history, painting, sculpture, graphic arts, decorative arts, city planning, real estate, and archaeology. It is the largest library of architecture in the US, with more than 400,000 volumes, most of which are non-circulating. The Ware collection, focused on urban planning and related fields, does circulate. Avery is often preferred over Butler for its relatively abundant sunlight and more serene space. Art History majors in particular gravitate there." });
    desc.set("Engineering Library", { short: "The Ambrose Monell Engineering Library is located on the fourth floor of Mudd.", long: "The Ambrose Monell Engineering Library is located on the fourth floor of Mudd. The collection includes Civil, Mechanical, Electrical, and Chemical Engineering; Computer Science; metallurgy; mining; Operations Research; Applied Physics; Applied Mathematics; and nuclear engineering. The library is usually sparsely populated, but tends to draw crowds of engineers during midterm and final exam time. Do not expect the library to be a quiet place to study as most students in the library are working on problem sets together. " });
    desc.set("Middle East Library", { short: "The library has two collections: Middle East Studies Collection and Islamic Studies Collection.", long: "The library has two collections: Middle East Studies Collection and Islamic Studies Collection. Middle East Studies covers all disciplines in the study of human societies, past and present, in the following countries: Morocco, Tunisia, Algeria, Libya, and Egypt, the occupied territories of the West Bank and the Gaza Strip, Lebanon, Syria, Iraq, Jordan, Kuwait, Turkey, Azerbayjan, Armenia, Iran, Afghanistan, Bahrain, Oman, Qatar, Saudi Arabia, the United Arab Emirates, and Yemen. Islamic Studies covers all aspects of Islamic life and culture worldwide, especially art, history, literature, philosophy, and religion." });
    desc.set("Geology Library", { short: "The Geology Library is located on the sixth floor of Schermerhorn Hall. It's one of the smaller libraries on campus, but some consider it a hidden gem in the library system for its relative quiet.", long: "The Geology Library is located on the sixth floor of Schermerhorn Hall. It's one of the smaller libraries on campus, but some consider it a hidden gem in the library system for its relative quiet. It shares some books with the Geoscience Library, and you can request for books to be delivered to either the next business day." });
    desc.set("The Gottesman Libraries", { short: "The Gottesman Libraries at Teachers College, commonly known as Teachers College Library, is a large library serving Teachers College. It features one of the nation's largest collections on education and psychology, featuring over 500,000 volumes and numerous rare volumes.", long: "The Gottesman Libraries at Teachers College, commonly known as Teachers College Library, is a large library serving Teachers College. It features one of the nation's largest collections on education and psychology, featuring over 500,000 volumes and numerous rare volumes. The library is open to all students at Columbia, although printing requires a separate quota rather than NINJa. Borrowing privileges are generally available to students, with standard borrowing periods of one semester. Unlike other campus libraries, TC's library is very modern, well-lit, and clean. But most importantly, food and drinks are allowed. This is perhaps the reason why students from all of Columbia's schools come here to study (i.e. lots of law and medical students). Many students bring in whole pizza pies, sandwiches, and takeout. The second floor is dedicated to collaboration and is therefore designated as a talking area. The third floor, for the more serious individuals, is a quiet area. The first floor is, well, still up for decision as there is a mix of both quietness and nonsensical chatter. Students, including Columbia undergraduates, can reserve study rooms ahead of time online." });
    desc.set("Social Work Library", { short: "The Social Work Library is located in the School of Social Work Building at Amsterdam Ave and 122nd St. It shockingly features collections on social work.", long: "The Social Work Library is located in the School of Social Work Building at Amsterdam Ave and 122nd St. It shockingly features collections on social work. Access is available to all undergraduates, despite some occasionally alarmist signs. It's not especially large in terms of study space, but it has a number of corrals and tables available. It does feature some NINJa printers. The library has excellent natural light and can be a nice off the beaten path study spot." });
    desc.set("Library of The Jewish Theological Seminary", { short: "The Library of the Jewish Theological Seminary holds 400,000 volumes, which makes it the largest and most extensive collection of Hebraic and Judaic material in the Western Hemisphere. The library holds items beginning from the 10th century.", long: "The Library of the Jewish Theological Seminary holds 400,000 volumes, which makes it the largest and most extensive collection of Hebraic and Judaic material in the Western Hemisphere. The library holds items beginning from the 10th century. The library employs a staff of thirty." });
    desc.set("The Burke Library", { short: "The Burke Library is the library of Union Theological Seminary. It features one of the largest and most unique theological collections in the western hemisphere. Burke received approximately $10 million to fund renovations to the library around 2000.", long: "The Burke Library is the library of Union Theological Seminary. It features one of the largest and most unique theological collections in the western hemisphere. Burke received approximately $10 million to fund renovations to the library around 2000. The library is open to all CUID holders with library access, including borrowing privileges. It's more open to free access than many of the other Columbia libraries. Despite the access it's used relatively infrequently by Columbia students. Accordingly, the library has a serious mood—one of devoted students laboring hard at material which they do not hate. It's also right across the block from Broadway Au Lait, and thus close to cheapish snacks and, more importantly, cheap coffee." });
    

    
    

    desc.set("Slavic & East Central Europe", { short: "The East Central European Center concerns itself with the countries and peoples in the geographical arc from Bulgaria, (ex-) Yugoslavia, Romania in the southeast of Europe, through Hungary, Czech Republic and Slovakia in the center, to Poland and the Baltic states in northeastern Europe.",long:"The East Central European Center concerns itself with the countries and peoples in the geographical arc from Bulgaria, (ex-) Yugoslavia, Romania in the southeast of Europe, through Hungary, Czech Republic and Slovakia in the center, to Poland and the Baltic states in northeastern Europe.  For half a millennium these peoples had a similar destiny in that they were constituents of multinational empires, including what might be termed the Soviet Empire in the second half of the twentieth century. Even after that last empire was dismantled in 1989, the countries of East Central Europe have continued to have common concerns and similar interaction with the EU and global capitalism.  They have recent shared concerns, such as populism, a reassertive Russia, and the migration of refugees. "});
    desc.set("Lehman Social Sciences Library", { short: "The Lehman Social Sciences Library holds a contemporary collection of more than 330,000 volumes and approximately 1,700 current periodical titles. ",long:"The Lehman Social Sciences Library holds a contemporary collection of more than 330,000 volumes and approximately 1,700 current periodical titles. It includes materials acquired by Columbia libraries since 1974 in political science, sociology, social and cultural anthropology, political geography, journalism, environmental science, as well as a rich collection of materials on post-World-War-II international relations. It houses essays produced by Columbia students in the Graduate Schools of Journalism."});
    desc.set("Rare Book and Manuscript Library", { short: "Located on the 6th Floor of Columbia University's Butler Library, the library holds the special collections of Columbia University, as well as the Columbia University Archives.",long:"Columbia University's Rare Book & Manuscript Library is located on the 6th Floor of Columbia University's Butler Library. The library holds the special collections of Columbia University, as well as the Columbia University Archives. The range of the library's holdings spans more than 4,000 years, from cylinder seals created in Mesopotamia to contemporary artists' books. In addition to printed and manuscript resources, the library contains cuneiform tablets, papyri, ostraca, astronomical and mathematical instruments, maps, works of art, photographs, posters, early printing presses and papermaking equipment, type specimens, sound and moving image recordings, theater set models, puppets, masks, ephemera and memorabilia. The Rare Book and Manuscript Library includes unique and rare materials related to all subject areas."});
    desc.set("Interchurch Ecumenical Library", { short: "The Interchurch Center is a 19-story limestone-clad office building located at 475 Riverside Drive and West 120th Street in Manhattan, New York City.",long:"The Interchurch Center is a 19-story limestone-clad office building located at 475 Riverside Drive and West 120th Street in Manhattan, New York City. It is the headquarters for the international humanitarian ministry Church World Service, and also houses a wide variety of church agencies and ecumenical and interfaith organizations as well as some nonprofit foundations and faith-related organizations. The National Council of Churches also occupied the building from its inception, but in February 2013, the NCCC consolidated its offices on Capitol Hill in Washington, DC, and vacated its New York headquarters facilities.[1] NCCC's sister agency, Church World Service, remains a tenant in the building."});
    desc.set("Psychology Library", { short: "The Psychology collection contains 36,000 volumes, approximately 185 current serial titles and about 70 videos",long:"The Psychology collection contains 36,000 volumes, approximately 185 current serial titles and about 70 videos. The collection is strong in the area of experimental psychology as related to social psychology, personality, cognition, perception, sensation and psychophysics; animal learning and behavior; and neuroscience. In addition, the collection houses material in the areas of history of psychology and statistics as it applies to psychological research."});
    desc.set("Science and Engineering Library", { short: "The Science & Engineering Libraries are pleased to annouce that the new Science & Engineering Library at Columbia University opened in the Northwest Corner Building on January 18, 2011.", long: "The Science & Engineering Libraries are pleased to annouce that the new Science & Engineering Library at Columbia University opened in the Northwest Corner Building on January 18, 2011. The new library focuses on research support for the fields of chemistry, biology, physics, astronomy, psychology, and engineering as well as providing a collaborative environment supporting rapidly expanding interdisciplinary science and engineering research. The library features seating and study spaces for 345 students and researchers with spectacular views of the Columbia campus and Morningside Heights."});
}

router.get('/info', function(req, res, next) {
    var name = req.param("name");
    if (info.get(name) == undefined) {
        var content = {name:name, like:0, comment:[]};
        info.set(name, content);
    }
    console.log(JSON.stringify(info)); 
    var c = info.get(name);
    res.json(c);
});

router.get('/like', function(req, res, next) {
    var name = req.param("name");
    var c = info.get(name);
    c.like += 1;
    res.json(c);
});

router.get('/comment', function(req, res, next) {
    var name = req.param("name");
    var comment = req.param("comment");
    var c = info.get(name);
    c.comment.push(comment);
    res.json(c);
});

router.get('/desc', function(req, res, next) {
    var name = req.param("name");
    var d = desc.get(name);
    if (d == undefined) {
      d = {short:"Not Available", long:"Not Available"};
    }
    res.json(d);
});

app.use('/', router);

app.listen(port);
console.log('App running on port', port);
