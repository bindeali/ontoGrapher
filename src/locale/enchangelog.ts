export const enChangelog: {
  [key: string]: { [key: string]: { [key: string]: string[] } };
} = {
  "2023": {
    "3": {
      "8": ["New user interface"],
    },
  },
  "2022": {
    "3": {
      "22": [
        "Link/relationship multiselection:",
        "Using Ctrl + click on links allows (de)selection of multiple links/relationships",
        "This brings up the detail panel, with which it is possible to set cardinalities to all selected links/relationships at the same time",
      ],
    },
    "2": {
      "16": [
        "Control scheme update:",
        "Clicking and dragging the canvas with the left mouse button moves the canvas",
        "Middle mouse button (scroll wheel click) does not perform any action",
      ],
    },
  },
  "2021": {
    "12": {
      "10": [
        "Added setting to change user interface language",
        'Accessible through the "View" submenu',
        'Moved setting to change vocabulary language from top left to the "View" submenu',
      ],
    },
    "10": {
      "14": [
        "Added function to save diagrams to PNG images",
        'Accessible through the "Generate image" button on the main panel',
      ],
    },
    "7": {
      "28": [
        "Expansion of compact view functionality by providing ways to manage relationships and intrinsic tropes",
        "Added support to create new relationships in compact mode in the relationship creation modal",
        "Added support to manage terms' intrinsic tropes in the term detail panel in compact view",
      ],
    },
    "6": {
      "9": [
        "Full/Compact view is now remembered for each diagram, i.e. if you set the view of a diagram to Compact and come back to it later, the view will still be be Compact",
      ],
    },
    "5": {
      "12": [
        "Implemented the SSP cache for the Connections card in the Detail panel",
        "Under the ordinary list of connections within the workspace, you can now optionally see other connections to your selected term not currently represented in the workspace",
        'To view them, click the "Terms outside the workspace" link in the Connections card of the Detail panel',
        "All connection actions (dragging onto canvas, multiselection...) work for these connections as well",
      ],
    },
    "4": {
      "30": [
        "Implemented the SSP cache",
        "The search function now also searches the SSP cache and displays results below the usual workspace vocabularies",
        "The 📚 button can be used to group results by vocabularies",
        "The select can be used to filter results by vocabulary or vocabularies. If a vocabulary is selected and the search field is empty, the whole vocabulary is shown",
        "Hovering over a term reveals additional information about the term",
        "A ⭐ symbol next to the term signifies that the term is already in the workspace",
        "To add a term to the workspace, drag it onto the canvas as with any other term",
        "You can also ctrl + click onto terms to select multiple terms and ctrl + click on vocabularies to select all terms in the group",
        "The terms added can be read only",
        "The terms are added under a new read-only vocabulary. A counter is displayed if the vocabulary is not fully represented in the workspace. Clicking on this counter displays all the terms of the vocabulary",
      ],
    },
    "3": {
      "19": [
        "Changed the look of relationships listed in terms' detail panel:",
        "Terms listed there can now be (de)selected via left click",
        "Term(s) can be dragged onto the canvas the same way as from the left panel",
        "Added a row of buttons to the relationship view:",
        "The ➕ button adds the selected terms in a circular pattern as before",
        "The 🔍 button allows you to filter relationships by type, term label, stereotype, vocabulary, etc.",
      ],
    },
    "2": {
      "7": [
        "Formally added Czech language",
        "Added a Report button",
        "Changed the Help section to include a cheat sheet",
      ],
      "24": [
        "Changed behaviour of multiselection: selection in the left panel is reflected on the canvas and vice versa",
        "Change of controls described in the Help section",
      ],
    },
  },
};
