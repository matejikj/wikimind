Introduction

V minulem desetileti se vyuziti internetu a internetovych sluzeb stalo beznou soucasti zivota. Snad pro kazdou oblast naseho kazdodenniho zivota lze vyuzit aplikaci, ktera nam pomaha sbirat data o nas a analyzovat nase zvyky. At uz se jedna o udaje pozorovane behem spanku, pocet kroku behem dne, lokalizovane fotografie nebo platby mobilnim zarizenim. Za kazdou z techto aplikaci urcite stoji skvely napad, ktery se uzivatelum libil. Uspesny startup casem ceka prerod na firmu, ktery je vetsinou podporovany silnym fondem v zadech. Jeden z hlhavnich cilu se potom stava udrzeni podilu a generovani zisku. Ke generovani zisku je pro tyto firmy velmi dulezite znat nazor svych uzivatelu a sbirat jejich data. Takovy sber samozrejme podleha regulacim a firma by mela dbat na ochranu dat uzivatelu. V minulosti ale nalezneme pripady, kdy firmy nejenze data uzivatelu nechranily, ale dokonce je vyuzivaly ke generovani jeste vetsich zisku. Napriklad facebook takova data prodaval firme, ktera tato data potom analyzovala a vyuzivala k ovlivnovani verejneho mineni.

Ackoliv je bezpeci dat casto diskutovanym tematem. K posunum v teto oblasti dochazi pouze velmi pomalu a to logicky kvuli odporu spolecnosti, kterym soucasna situace vyhovuje. Mastodonti jako Google, Facebook nebo TikTok maji data uzivatelu ulozena u sebe a ackoliv by se takove ulozeni melo ridit pravidly danymi legislativou, skutecne vyuziti takovych dat temito spolecnostmi zustava zahaleno tajemstvim.

Jednim z velkych odpurcu takovych praktik je "zakladatel" internetu, sir Tim Berners Lee. Ten nechal vzniknout iniciative "Vratme internet zpet uzivatelum". Stoji jako jeden z hlavnich predstavitelu myslenky, ze pristup ke svym datum by mel mit pod svou kontrolou jen a pouze uzivatel. Platforma, ktera ma tohle umoznovat se jmenuje SOLID(Social linked data). Uzivatelova data jsou nejenze pod plnou spravou uzivatele, ale krome toho, tato platforma chce vyuzit potencial linked dat.

Dalsim casto diskutovanym tematem je ohromne mnozstvi dat, ktere se dnes na uzivatele vali z kazde strany. Objem informaci, ktere bezny obcan zaznamena behem tydne se rovna objemu informaci, ktere jeste pred stoletim mohl vstrebat behem celeho roku. V takove zaplave dat je velmi tezke se vyznat a udelat si kriticky nazor. Skolstvi na takovy prekotny vyvoj techmologii nebylo pripravene a tak je celkem bezne, ze zak neni vubec pripravovan s takovym objemem dat pracovat. Mlade zaky je pritom velmi dulezite naucit davani si dat do souvislosti a kriticky si utvorit svuj vlastni nazor.

Velkym pomocnikem by s tim mohly byt samotne aplikace. Ovsem vyuziti modernich technologii v ceskem skolstvi je velmi chabe a pozadu oproti zemim v zapadni Evrope, ktere potencial novych technologii vyuzivaji mnohem lepe a pomahaji tak zakum v pochopeni latky, chapani souvislosti a davani si temat do kontextu.

Goals

V ramci teto prace budeme chtit analyzovat hlavni aspekty, prednosti a nedostatky nove technologie SOLID. Jelikoz se jedna o novou technologii, na internetu neni k nalezeni velke mnozstvi dokumentace nebo paradigmat, jak tuto technologii vyuzit. Hlavnim ukolem potom pomoci aplikovat principy teto platformy pri tvorbe aplikace, ktera bude pomahat pri vyuce zakum k utvoreni sirsich souvislosti mezi vyucovanou latkou.

Pro tyto ucely vyuzijeme linked data, dalsi z technologii, na ktere je platforma SOLID postavena. Jedna se o "propojena data", ktera jsou strojove citelna a definuji vztahy mezi daty. Na internetu existuji databaze, ktere takova data shromazduji a volne nabizeji k prozkoumavani uzivatelu. Ucel a vyuziti jednotlivych databazi analyzujeme a navrhneme zpusob pro vyuziti jedne z techto databazi pro inteligentni napovedu v nasi aplikaci.

1. Related work

• popisu hlavni myslenky platformy SOLID

1.1 Decentralization and Linked data



1.2 Linked data specifications

1.3 Linked data technologies

1.4 Knowledge bases

1.5 Similar tools
V nasledujici casti si polozime podminky, ktere si prejeme, aby aplikace splnovala. Nasledne si predstavime jiz existujici aplikace a tooly a budeme se na ne koukat optikou techto podminek, zde je splnuji ci nikoliv.
• Solid platforma 
• Intuitivni uzivatelske prostredi
• Aplikace uzivateli doporucuje mozne dalsi navrhy entit pro pridani do grafu
• Aplikace umoznuje nahled na data jako ontologii
• Aplikace umoznuje vytvaret a sdilet materialy s ostatnimi uzivateli
• Aplikace obsahuje prvky socialni site pro interakci mezi uzivateli a pouziti ve vyuce

1.6 Overview


2. Analysis

2.1 Nonfunctional requirements

NR1
Cilem je vytvorit webovou aplikaci

NR2
Aplikace pro praci s daty vyuziva platformy SOLID

NR3
Aplikace je intuitivni a uzivatelsky jednoducha a privetiva kvuli pouziti u mladych zaku

NR4
Aplikace lze snadno nasadit pomoci dockeru


2.2 Functional requirements

FR1
Uzivatel se autentifikuje pomoci sveho datapodu

2.3 Use cases

UC1
Uzivatel se prihlasuje a odhlasuje do databaze

UC2
Uzivatel 

2.4 Knowledge base


3. Design

3.1 System architecture overview

popisu highlevel jako je aplikace slozena.

Ze jsem


Pridam obrazek 

3.2 Solid app architecture



3.3 Knowledge base server


3.4 User interface


4. Implementation

4.1 Frameworks and libraries

• Udelam porovnani frontend frameworku (Vue, React a Angular)
• Napisu proc jsme si vybral React

4.2 SolidPod

Napisu, ja

4.3 Authentication

4.4 Message notifications

5. Testovani

Popisu typy testovani, ktere se bezne pouzivaji a ktere jsem si vybral

5.1 Unit testy

Na kazdou komponentu kterou udelam, napisu unit testy

5.2 User testy

Necham aplikaci zkusit uzivateli a udelat tabulku jendotlivych kriterii

5.3 Test nainstalovani vlastniho pod serveru a jeho vyzkouseni na aplikaci

Popisu jake existuji alternativy vlastniho serveru

• jsou ruzne servery - node a jine
• udelam analyzu serveru
• sepisu jak jsem to instaloval
• otestovani, ze to funguje pro mou aplikaci

5.4 Shrnuti testu
Shrnu testy a hlavne jake byly pozitiva a negativa vlastni instalace
A zamerim se na shrnuti uzivatelskeho testu

6. programatorka prirucka

popsat co kde najdu v adresarove strukture
popsat jak jsou cleneny casti reacti aplikace
popsat jak pracovat s dokumentaci
popsat zpusob nasazeni
popsat zpusob jak si spustit vyvojove prostredi

7. Uzivatelska prirucka

napsat uzivatelskou prirucku

8. Zhodnoceni

jak lze tuto praci dale rozsirit
jeji vyuziti
popsat klady a zapory prace s platformou SOLID
