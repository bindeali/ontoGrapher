export const csChangelog: {
  [key: string]: { [key: string]: { [key: string]: string[] } };
} = {
  "2021": {
    "4": {
      "30": [
        "Implementována SSP cache",
        "Vyhledávání pojmů nyní vyhledává i v SSP cache. Výsledky tohoto vyhledávání jsou zobrazeny pod seznamem slovníků",
        "Tlačítko 📚 seskupí výsledky podle slovníků",
        "Výběr vedle filtruje výsledky na slovník/y. Pokud je vybrán slovník a vyhledávací pole je prázdné, zobrazí se všechny pojmy daného slovníku",
        "Najetí myší na pojem ukáže podrobnější informace o daném pojmu",
        "Symbol ⭐ určuje, že daný pojem už je přítomen v pracovním prostoru",
        "Pro přidání pojmu jej přetáhněte na plátno jako jakýkoliv jiný pojem",
        "Můžete také použít ctrl + kliknutí na pojmy pro vybrání více pojmů najednou a ctrl + kliknutí na slovník pro vybrání všech pojmů ze skupiny",
        "Přidané pojmy jsou pouze pro čtení",
        "Pojmy jsou přidané do slovníku pouze pro čtení. Pokud není slovník zastoupen všemi jeho pojmy v pracovním prostoru, objeví se u slovníku počet pojmů. Kliknutím na tento počet se zobrazí všechny pojmy slovníku",
      ],
    },
    "3": {
      "19": [
        "Změněn vzhled výpisu vztahů v panelu detailu pojmu:",
        "Zde vypsané vztahy mohou být vybrány levým tlačítkem",
        "Pojem/pojmy mohou být přetáhnuty na plátno stejným způsobem, jako z levého panelu",
        "Přidána řada tlačítek k výpisu:",
        "Tlačítko ➕ přidá vybrané pojmy na plátno kolem vybraného pojmu jako předtím",
        "Tlačítko 🔍 umožňuje filtrovat vztahy podle typu, jména pojmu, stereotypů, slovníku atd.",
      ],
    },
    "2": {
      "7": [
        "Přidána čeština",
        "Přidáno tlačítko pro ohlašování chyb/navrhování úprav",
        'Nápověda změněna na "tahák"',
      ],
      "24": [
        "Změněno chování vybírání více pojmů: výběr v levém panelu se projevuje i na plátně a naopak",
        "Změny v ovládání popsány v Nápovědě",
      ],
    },
  },
};
