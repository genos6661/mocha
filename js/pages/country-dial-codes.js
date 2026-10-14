/**
 * DAFTAR KODE TELEPON NEGARA
 * ------------------------------------------------------------------
 * window.COUNTRY_DIAL_CODES = [{ iso, name, dial, alt }, ...]
 *   iso  : kode negara ISO 2 huruf (sama dengan profiles.negara)
 *   name : nama negara (Inggris)
 *   dial : kode telepon, hanya digit, tanpa "+"  (mis. "62")
 *   alt  : nama lain / nama Indonesia, dipakai agar bisa dicari (opsional)
 *
 * Format sumber: satu negara per baris  ISO|Nama|Kode|Alias
 * Untuk menambah / mengubah negara cukup edit baris di RAW.
 */
(function (window) {
  const RAW = `
AF|Afghanistan|93|Afganistan
AL|Albania|355
DZ|Algeria|213|Aljazair
AS|American Samoa|1684
AD|Andorra|376
AO|Angola|244
AI|Anguilla|1264
AG|Antigua and Barbuda|1268
AR|Argentina|54
AM|Armenia|374
AW|Aruba|297
AU|Australia|61
AT|Austria|43
AZ|Azerbaijan|994
BS|Bahamas|1242
BH|Bahrain|973
BD|Bangladesh|880
BB|Barbados|1246
BY|Belarus|375
BE|Belgium|32|Belgia
BZ|Belize|501
BJ|Benin|229
BM|Bermuda|1441
BT|Bhutan|975
BO|Bolivia|591
BA|Bosnia and Herzegovina|387
BW|Botswana|267
BR|Brazil|55|Brasil
VG|British Virgin Islands|1284
BN|Brunei|673
BG|Bulgaria|359
BF|Burkina Faso|226
BI|Burundi|257
KH|Cambodia|855|Kamboja
CM|Cameroon|237|Kamerun
CA|Canada|1|Kanada
CV|Cape Verde|238
KY|Cayman Islands|1345
CF|Central African Republic|236
TD|Chad|235
CL|Chile|56|Chili
CN|China|86|Tiongkok Cina
CO|Colombia|57|Kolombia
KM|Comoros|269|Komoro
CG|Congo|242
CD|Congo (DR)|243
CK|Cook Islands|682
CR|Costa Rica|506
CI|Cote d'Ivoire|225|Pantai Gading Ivory Coast
HR|Croatia|385|Kroasia
CU|Cuba|53|Kuba
CW|Curacao|599
CY|Cyprus|357|Siprus
CZ|Czech Republic|420|Ceko
DK|Denmark|45
DJ|Djibouti|253
DM|Dominica|1767
DO|Dominican Republic|1809
TL|Timor-Leste|670|Timor Leste East Timor
EC|Ecuador|593|Ekuador
EG|Egypt|20|Mesir
SV|El Salvador|503
GQ|Equatorial Guinea|240
ER|Eritrea|291
EE|Estonia|372
SZ|Eswatini|268|Swaziland
ET|Ethiopia|251
FK|Falkland Islands|500
FO|Faroe Islands|298
FJ|Fiji|679
FI|Finland|358|Finlandia
FR|France|33|Prancis
GF|French Guiana|594
PF|French Polynesia|689|Polinesia Prancis
GA|Gabon|241
GM|Gambia|220
GE|Georgia|995
DE|Germany|49|Jerman
GH|Ghana|233
GI|Gibraltar|350
GR|Greece|30|Yunani
GL|Greenland|299
GD|Grenada|1473
GP|Guadeloupe|590
GU|Guam|1671
GT|Guatemala|502
GG|Guernsey|44
GN|Guinea|224
GW|Guinea-Bissau|245
GY|Guyana|592
HT|Haiti|509
HN|Honduras|504
HK|Hong Kong|852
HU|Hungary|36|Hungaria
IS|Iceland|354|Islandia
IN|India|91
ID|Indonesia|62
IR|Iran|98
IQ|Iraq|964|Irak
IE|Ireland|353|Irlandia
IM|Isle of Man|44
IL|Israel|972
IT|Italy|39|Italia
JM|Jamaica|1876|Jamaika
JP|Japan|81|Jepang
JE|Jersey|44
JO|Jordan|962|Yordania
KZ|Kazakhstan|7
KE|Kenya|254
KI|Kiribati|686
XK|Kosovo|383
KW|Kuwait|965
KG|Kyrgyzstan|996|Kirgizstan
LA|Laos|856
LV|Latvia|371
LB|Lebanon|961
LS|Lesotho|266
LR|Liberia|231
LY|Libya|218
LI|Liechtenstein|423
LT|Lithuania|370|Lituania
LU|Luxembourg|352|Luksemburg
MO|Macau|853|Makau
MG|Madagascar|261|Madagaskar
MW|Malawi|265
MY|Malaysia|60
MV|Maldives|960|Maladewa
ML|Mali|223
MT|Malta|356
MH|Marshall Islands|692
MQ|Martinique|596
MR|Mauritania|222
MU|Mauritius|230
YT|Mayotte|262
MX|Mexico|52|Meksiko
FM|Micronesia|691
MD|Moldova|373
MC|Monaco|377
MN|Mongolia|976
ME|Montenegro|382
MS|Montserrat|1664
MA|Morocco|212|Maroko
MZ|Mozambique|258|Mozambik
MM|Myanmar|95|Burma
NA|Namibia|264
NR|Nauru|674
NP|Nepal|977
NL|Netherlands|31|Belanda Holland
NC|New Caledonia|687|Kaledonia Baru
NZ|New Zealand|64|Selandia Baru
NI|Nicaragua|505|Nikaragua
NE|Niger|227
NG|Nigeria|234
NU|Niue|683
NF|Norfolk Island|672
KP|North Korea|850|Korea Utara
MK|North Macedonia|389|Makedonia
MP|Northern Mariana Islands|1670
NO|Norway|47|Norwegia
OM|Oman|968
PK|Pakistan|92
PW|Palau|680
PS|Palestine|970|Palestina
PA|Panama|507
PG|Papua New Guinea|675|Papua Nugini
PY|Paraguay|595
PE|Peru|51
PH|Philippines|63|Filipina
PL|Poland|48|Polandia
PT|Portugal|351
PR|Puerto Rico|1787|Puerto Riko
QA|Qatar|974
RE|Reunion|262
RO|Romania|40|Rumania
RU|Russia|7|Rusia
RW|Rwanda|250
BL|Saint Barthelemy|590
SH|Saint Helena|290
KN|Saint Kitts and Nevis|1869
LC|Saint Lucia|1758
MF|Saint Martin|590
PM|Saint Pierre and Miquelon|508
VC|Saint Vincent and the Grenadines|1784
WS|Samoa|685
SM|San Marino|378
ST|Sao Tome and Principe|239
SA|Saudi Arabia|966|Arab Saudi
SN|Senegal|221
RS|Serbia|381
SC|Seychelles|248
SL|Sierra Leone|232
SG|Singapore|65|Singapura
SX|Sint Maarten|1721
SK|Slovakia|421|Slowakia
SI|Slovenia|386
SB|Solomon Islands|677|Kepulauan Solomon
SO|Somalia|252
ZA|South Africa|27|Afrika Selatan
KR|South Korea|82|Korea Selatan
SS|South Sudan|211|Sudan Selatan
ES|Spain|34|Spanyol
LK|Sri Lanka|94
SD|Sudan|249
SR|Suriname|597
SE|Sweden|46|Swedia
CH|Switzerland|41|Swiss
SY|Syria|963|Suriah
TW|Taiwan|886
TJ|Tajikistan|992
TZ|Tanzania|255
TH|Thailand|66
TG|Togo|228
TK|Tokelau|690
TO|Tonga|676
TT|Trinidad and Tobago|1868
TN|Tunisia|216
TR|Turkey|90|Turki
TM|Turkmenistan|993
TC|Turks and Caicos Islands|1649
TV|Tuvalu|688
UG|Uganda|256
UA|Ukraine|380|Ukraina
AE|United Arab Emirates|971|Uni Emirat Arab UAE
GB|United Kingdom|44|Inggris Britania Raya UK
US|United States|1|Amerika Serikat USA
VI|US Virgin Islands|1340
UY|Uruguay|598
UZ|Uzbekistan|998
VU|Vanuatu|678
VA|Vatican City|379|Vatikan
VE|Venezuela|58
VN|Vietnam|84
WF|Wallis and Futuna|681
EH|Western Sahara|212|Sahara Barat
YE|Yemen|967|Yaman
ZM|Zambia|260
ZW|Zimbabwe|263
AX|Aland Islands|35818
`;

  window.COUNTRY_DIAL_CODES = RAW.trim().split('\n').map(line => {
    const [iso, name, dial, alt] = line.split('|');
    return { iso, name, dial, alt: alt || '' };
  });
})(window);
