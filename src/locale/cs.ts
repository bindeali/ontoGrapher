import { en } from "./en";

export const cs: { [Property in keyof typeof en]: string } = {
  unknown: "Není známo",
  vocabularySelectInfo:
    "Určuje slovníky, ke kterým je diagram přiřazen. Při přidávání slovníků do projektu Kontrolního panelu se přidají pouze ty diagramy, které jsou k těmto slovníkům přiřazené.",
  addLanguage: "Přidat vstup pro další jazyk",
  modalNewTropeDescription:
    "Jméno pro novou vlastnost (nelze později změnit!):",
  createTrope: "Vytvořit novou vlastnost",
  assignExistingTrope: "Přiřadit existující vlastnost",
  noExistingTropes:
    "Žádné volné vlastnosti v modelu nejsou. Prosíme o odebrání vlastnosti jinému pojmu nebo o vytvoření nové vlastnosti.",
  assignTropeHeader: "Přiřadit vlastnost pojmu ",
  assignTropeConfirm: "Přiřadit vlastnost",
  mustAssignTropeConfirm: "Vyberte vlastnost na přiřazení.",
  deleteLink: "Smazat vztah",
  openDiagram: "Otevřít diagram",
  closeDiagram: "Zavřít diagram",
  deleteDiagram: "Smazat diagram",
  createDiagram: "Vytvořit nový diagram",
  showPreview: "Ukázat náhled",
  collaborators: "Spolupracovali:",
  name: "Název",
  vocabularies: "Slovníky",
  lastModifiedDate: "Datum poslední modifikace:",
  creationDate: "Datum vytvoření:",
  linkInfo: "Ukázat detail vztahu",
  addAltLabelPlaceholder: "Přidat nový synonym",
  addAltLabel: "Nový synonym",
  addAltLabelNoName: "Pole nesmí být prázdné.",
  removeTrope: "Odebrat pojmu vlastnost",
  assignTrope: "Přiřadit další vlastnost k pojmu",
  untitledProject: "OntoGrapher",
  unsorted: "Bez typu",
  updating: "Ukládání...",
  newVersion:
    "Od vašeho posledního používání OntoGrapher získal nové funkce! Klikněte sem pro detailní popis změn.",
  retry: "Zopakovat akci?",
  errorUpdating: "Chyba: ukládání se nezdařilo.",
  workspaceReady: "Připraveno k práci. Vaše změny se průběžně ukládají.",
  filterVocabulariesPlaceholder: "Vybrat slovník(y)...",
  termsFromOtherVocabularies: "Pojmy z ostatních slovníků",
  modalNewElemLengthError: "Jméno musí mít mezi 2 a 150 znaky.",
  modalNewElemCharacterError: "Jméno nemůže mít jenom speciální znaky.",
  modalNewElemIRI: "Pojem bude vytvořen s tímto IRI:",
  terms: "pojmy",
  termsCase: "pojmů",
  fromList: "Ze seznamu",
  otherVocabularies: "Ostatní slovníky",
  authenticationError:
    "Chyba autentikace. Prosím, kontaktujte serverového administrátora.",
  authenticationUpdateError:
    "Chyba autentikace. Prosím, načtěte stránku znovu.",
  modalRemoveConceptConnectionsDescription:
    "Varování: pojem, který se chystáte smazat, je spojen s pojmy mimo vypsané slovníky relacemi, které zde nelze smazat. Tyto relace proto zůstanou v databázi:",
  authenticationExpired: "Autentikace vypršela. Prosím, načtěte stránku znovu.",
  authenticationTimeout: "Dotaz na autentikační server vypršel.",
  logout: "Odhlásit",
  detailPanelMultipleLinks: "Více vybraných vazeb",
  detailPanelMultipleRelationships: "Více vybraných vztahů",
  detailPanelMultipleLinksEditable:
    "Z výběru lze přiřadit kardinality následujícím vazbám:",
  detailPanelMultipleRelationshipsEditable:
    "Z výběru lze přiřadit kardinality následujícím vztahům:",
  detailPanelMultipleLinksNotEditable:
    "Z výběru nelze přiřadit kardinality žádné vazbě.",
  detailPanelMultipleRelationshipsNotEditable:
    "Z výběru nelze přiřadit kardinality žádnému vztahu.",
  detailPanelPrefLabel: "Jméno",
  detailPanelAltLabel: "Synonyma",
  detailPanelInScheme: "Ve slovníku",
  detailPanelDefinition: "Definice",
  detailPanelStereotype: "Stereotyp",
  setCanvasLanguage: "Zobrazovaný jazyk slovníků",
  setInterfaceLanguage: "Jazyk uživatelského rozhraní",
  ontoGrapher: "OntoGrapher",
  errorMissingRestriction: "Restrikce nebyla nalezena",
  validationNumber: "#",
  hiddenTermsAndLinks:
    "Některé pojmy a vazby jsou v kompaktním pohledu skryty. Přepněte zpět na úplný pohled pro jejich obnovení.",
  validationName: "Pojem",
  validationSeverity: "Závažnost",
  errorConnectionLost: "Chyba: připojení k databázi bylo přerušeno.",
  diagramTab: "Diagramy",
  modalNewElemExistsError:
    "Pojem s tímto jménem již ve vybraném slovníku existuje.",
  setAsDisplayName: "Nastavit jako zobrazované jméno",
  conforms: "Všechny pojmy a vztahy jsou validní",
  validationError: "Zpráva",
  validationReload: "Obnovit",
  validation: "Výsledky kontroly",
  downloadDiagramImage: "Stáhnout obrázek",
  previewDiagramImage: "Vytvořit náhled",
  exportDiagram: "Exportovat diagram...",
  generateDiagramImageModalTitle: "Exportovat diagram ",
  generateDiagramList: "Jako výpis pojmů",
  generateDiagramImage: "Jako obrázek",
  downloadDiagramList: "Stáhnout výpis",
  generateDiagramListType: "Typ souboru",
  settings: "Možnosti",
  preview: "Náhled",
  language: "Jazyk",
  representation: "Pohled",
  representationCompact: "Kompaktní",
  format: "Formát souboru",
  representationFull: "Úplný",
  generateDiagramImageInBlackAndWhite: "Vykreslit černobíle",
  generateDiagramNoElementsError:
    "Nelze vytvořit obrázek, jelikož v diagramu není ani jeden pojem.",
  setStereotypeUML: "Nastavit typový stereotyp",
  setStereotypeData: "Nastavit OntoUML stereotyp",
  noStereotypeUML: "Žádný typový stereotyp",
  noStereotypeData: "Žádný OntoUML stereotyp",
  anyStereotypeType: "Všechny typové stereotypy",
  anyStereotypeOnto: "Všechny OntoUML stereotypy",
  anyLink: "Všechny vazby",
  anyVocabulary: "Všechny slovníky",
  filterSearchPlaceholder: "Název/synonym pojmu",
  sourceCardinality: "Kardinalita u zdroje",
  targetCardinality: "Kardinalita u cíle",
  loading: "Načítání...",
  validationLoadingError:
    "Připojení k validačnímu serveru se nezdařilo. Prosím, zkuste to znovu.",
  pleaseReload:
    "Chyba: nenalezen žádný slovník. Prosím, zkontrolujte IRI slovníku/ů.",
  connectionError: "Chyba při načítání slovníku/ů.",
  spreadLinks: "Zobrazit všechny vazby na plátně",
  spreadRelationships: "Zobrazit všechny vztahy na plátně",
  links: "Vazby",
  relationships: "Vztahy",
  linkType: "Typ",
  searchStereotypes: "Hledat...",
  untitled: "Nový diagram",
  none: "",
  cancel: "Zrušit",
  menuPanelHelp: "Nápověda",
  zoomIn: "Přiblížit",
  zoomOut: "Oddálit",
  default: "Výchozí",
  menuPanelSettings: "Nastavení",
  menuPanelCenterView: "Vycentrovat pohled",
  menuPanelZoom: "Obnovit přiblížení",
  menuPanelFitContent: "Zobrazit celý diagram najednou",
  close: "Zavřít",
  confirm: "Potvrdit",
  savedChanges: "✔ Úspěšně uloženo.",
  stableConnection: "Jste připojen/a k databázi.",
  brokenConnection: "Vaše připojení k databázi bylo přerušeno.",
  description: "Popis",
  vocabularyNotFound: "URL definice slovníků chybí nebo není správné",
  validate: "Zkontrolovat",
  modalRemoveConceptTitle: "Smazat pojem?",
  modalRemoveDiagramTitle: "Smazat diagram?",
  modalRemoveDiagramDescription: "Opravdu chcete smazat diagram?",
  selectTropeTypePlaceholder: "Vybrat vlastnost",
  modalNewIntrinsicTropeTitle: "Vytvořit novou vlastnost",
  intrinsicTropes: "Vlastnosti",
  groupSearchTerms: "Seskupit výsledky do slovníků",
  selectRelationship: "Vybrat z existujících vztahů",
  createNewRelationship: "Vytvořit nový vztah",
  showUsedRelationships: "Ukázat již použité vztahy",
  connectionVia: "typ vztahu",
  diagram: "v diagramu",
  modalRemoveConceptDescription: "Opravdu chcete smazat pojem?",
  definitions: "Popisy",
  representationCompactSwitch: "Přepnout na kompaktní pohled",
  representationFullSwitch: "Přepnout na úplný pohled",
  generateDiagramImageWithIRIData: "Vložit data o pohledu a IRI do SVG",
  showStereotypes: "Ukázat stereotypy",
  showIncompatibleLinks: "Ukázat nekompatibilní vazby",
  hideStereotypes: "Skrýt stereotypy",
  modalNewElemDescription: "Jméno pro nový pojem (nelze později změnit!):",
  modalNewElemTitle: "Vytvořit nový pojem",
  modalNewLinkTitleLink: "Vytvořit novou vazbu",
  modalNewLinkTitleRelationship: "Vytvořit nový vztah",
  changelog: "Seznam změn",
  modalNewLinkDescriptionLink: "Vyberte vazbu:",
  modalNewLinkDescriptionRelationship: "Vyberte vztah:",
  labels: "Jméno",
  delete: "Smazat",
  fileProjectSettingsDescriptions: "Popis",
  help: "Nápověda",
  modalNewElemError: "Jméno pojmu je povinné.",
  selectVocabulary: "Pojem se vytvoří ve slovníku:",
  view: "Vzhled",
  switchColors: "Barvy slovníků",
  reportIssue: "Nahlásit chybu",
  reportEnhancement: "Navrhnout úpravu",
  changelogButton: "Změny",
  errorInvalidCardinality: "Nastavená kardinalita není validní",
  errorParsingEnvironmentVariable:
    "Z promměného prostředí se nepodařila přečíst požadovaná proměnná",
  errorParsingKeycloakURL:
    "Z OIDC endpointu se nepodařilo přečíst Keycloak URL",
  errorParsingKeycloakRealm:
    "Z OIDC endpointu se nepodařilo přečíst Keycloak Realm",
  connectionListAddSelection: "Přidat výběr na plátno",
  connectionListEmptySelection: "Vyprázdnit výběr",
  connectionListShowSelection: "Vybrat zobrazené",
  connectionListShowFilter: "Zobrazit/skrýt filtr",
  connectionListEmptyFilter: "Zrušit filtr",
  downloadingTerms: "Přidávání vybraných pojmů...",
  modalRemoveReadOnlyConceptDescription:
    "Opravdu chcete smazat pojem? Daný pojem zůstane ve svém slovníku, pouze se odstraní ze seznamu pojmů společně s vazbami směřujícími k tomuto pojmu.",
  updatingWorkspaceVersion: "Aktualizace verze aplikačního kontextu...",
  vocabularyNotFullyRepresented:
    "Tento slovník není v seznamu zastoupen všemi jeho pojmy. Klikněte sem pro zobrazení všech pojmů tohoto slovníku.",
  criticalAlert: "Důležité upozornění",
  obsoleteDiagramsAlertIntro:
    "OntoGrapher detekoval, že byl smazán slovník. V důsledku jsou tyto diagramy nepublikovatelné a měly by být smazány:",
  obsoleteDiagramsAlertInfo:
    "Smazány jsou pouze kopie; originály se nemažou. Ponechání těchto diagramů zajistí konflikty při publikování.",
  obsoleteDiagramsAlertDeleteDiagrams: "Smazat tyto diagramy",
  vocabulariesPlural: "slovníky",
  vocabulariesMorePlural: "slovníků",
} as const;
