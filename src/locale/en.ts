export const en = {
  untitledProject: "Untitled workspace",
  unsorted: "Unsorted",
  updating: "Saving...",
  newVersion:
    "Ontographer has been updated with new functions since you were gone! Click here to see a detailed changelog.",
  retry: "Retry?",
  errorUpdating: "❌ Error: update unsuccessful.",
  workspaceReady: "✔ Workspace ready.",
  filterVocabulariesPlaceholder: "Pick vocabularies...",
  termsFromOtherLanguages: "Terms outside the workspace",
  modalNewElemLengthError: "The name must have between 2 and 150 characters.",
  modalNewElemCharacterError: "The name has to have non-special characters.",
  modalNewElemIRI: "The term will be created using IRI:",
  terms: "terms",
  termsCase: "terms",
  authenticationError:
    "Authentication error. Please contact the server administrator.",
  authenticationUpdateError: "Authentication error. Please refresh the page.",
  authenticationExpired: "Authentication expired. Please refresh the page.",
  authenticationTimeout: "Request to authentication service timed out.",
  logout: "Log out",
  detailPanelPrefLabel: "Label",
  detailPanelAltLabel: "Synonyms",
  detailPanelInScheme: "In vocabulary",
  detailPanelDefinition: "Definition",
  detailPanelStereotype: "Stereotype",
  ontoGrapher: "ontoGrapher",
  errorMissingRestriction: "Restriction not found",
  validationNumber: "#",
  deletedRelationships:
    "Some terms or relationships are hidden in Compact view. To see them again, switch to Full view.",
  validationName: "Label",
  validationSeverity: "Severity",
  errorConnectionLost: "Error: connection to workspace lost.",
  diagramTab: "Diagrams",
  modalNewElemExistsError:
    "A term with this label already exists in the vocabulary.",
  addAltLabelPlaceholder: "Add new synonym...",
  setAsDisplayName: "Set as display label",
  conforms: "Workspace conforms according to validation server",
  validationError: "Message",
  validationReload: "Refresh",
  validation: "Validation",
  setStereotypeUML: "Set Type stereotype",
  setStereotypeData: "Set OntoUML stereotype",
  noStereotypeUML: "No Type stereotype",
  noStereotypeData: "No OntoUML stereotype",
  anyStereotypeType: "Any Type stereotype",
  anyStereotypeOnto: "Any OntoUML stereotype",
  anyConnection: "Any relationship",
  anyVocabulary: "Any vocabulary",
  filterSearchPlaceholder: "Term label/synonym",
  sourceCardinality: "Source cardinality",
  targetCardinality: "Target cardinality",
  loading: "Loading...",
  validationLoadingError:
    "Connection to validation server unsuccessful. Please reload to try again.",
  pleaseReload: "Error: workspace not found. Please check the workspace IRI.",
  spreadConnections: "Explode connections",
  connections: "Connections",
  linkType: "Type",
  searchStereotypes: "Search...",
  untitled: "Untitled diagram",
  none: "",
  cancel: "Cancel",
  modalRemovePackageItemConnectionsDescription:
    "Warning: the term you are about to delete is connected to terms from outside the workspace with relations that cannot be deleted here. As such, these relations will remain in the database:",
  menuPanelHelp: "Help",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  menuPanelView: "View",
  menuPanelCenterView: "Center view",
  menuPanelZoom: "Restore zoom",
  menuPanelFitContent: "Scale content to fit view",
  close: "Close",
  confirm: "Confirm",
  savedChanges: "✔ Saved successfully.",
  stableConnection: "You are connected to the DB.",
  brokenConnection: "Your connection to the DB has been interrupted.",
  description: "Description",
  vocabularyNotFound: "Vocabulary definition URL is missing or incorrect",
  validate: "Validate",
  modalRemovePackageItemTitle: "Remove term?",
  modalRemoveDiagramTitle: "Remove diagram?",
  modalRemoveDiagramDescription:
    "Are you sure you want to remove the diagram? The layout of the diagram will be lost!",
  connectionVia: "using link",
  connectionTo: "to",
  connectionFrom: "from",
  diagram: "in diagram",
  modalRemovePackageItemDescription:
    "Are you sure you want to remove the term?",
  definitions: "Definitions",
  representationCompact: "Switch to Compact view",
  representationFull: "Switch to Full view",
  showStereotypes: "View stereotypes",
  showIncompatibleLinks: "Display incompatible relationships",
  hideStereotypes: "Hide stereotypes",
  modalNewElemDescription:
    "Enter a label for the new term (these cannot be changed later!):",
  modalNewElemTitle: "Create new term",
  modalNewLinkTitle: "Create new relationship",
  changelog: "Changelog",
  modalNewLinkDescription: "Choose a relationship from the selection below:",
  labels: "Labels",
  delete: "Delete",
  fileProjectSettingsDescriptions: "Descriptions",
  help: "Help",
  modalNewElemError: "You must enter a label in order to create a new term.",
  selectPackage: "Term will be created in:",
  fromList: "From the list",
  otherVocabularies: "Other vocabularies",
  view: "View",
  switchColors: "Vocabulary color scheme",
  reportIssue: "Report an issue",
  reportEnhancement: "Suggest an improvement",
  changelogButton: "Changelog",
  errorInvalidCardinality: "Set cardinality is invalid",
  errorParsingEnvironmentVariable:
    "Unable to parse variable from the environment",
  errorParsingKeycloakURL:
    "Unable to parse Keycloak URL from the OIDC endpoint",
  errorParsingKeycloakRealm:
    "Unable to parse Keycloak Realm from the OIDC endpoint",
  connectionListAddSelection: "Add selection onto the canvas",
  connectionListEmptySelection: "Clear selection",
  connectionListShowSelection: "Select visible connections",
  connectionListShowFilter: "Show/hide filter options",
  connectionListEmptyFilter: "Disable filter",
  downloadingTerms: "Adding selected terms into the workspace...",
  modalRemoveReadOnlyPackageItemDescription:
    "Are you sure you want to remove the term? This will remove the term and created connections to the term in the workspace, but won't delete the term from the vocabulary.",
  vocabularyNotFullyRepresented:
    "This workspace does not contain all terms from this vocabulary. Click here to show all terms of this vocabulary.",
  updatingWorkspaceVersion: "Updating workspace verion...",
} as const;
