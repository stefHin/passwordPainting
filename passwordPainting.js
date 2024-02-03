//#########################################################################################
//#########################################################################################
//##### global variables and stuff that needs to be called at loading of the page #########
//#########################################################################################
//#########################################################################################

var selectedColor = "#000000";
var currentPasswordField;
var currentGrid;
var pwCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~`! @#$%^&*()_-+={[}]|\\:;\"'<,>.?/"

addIconToAllPasswordFields();
addModalToDocument();

//#########################################################################################
//#########################################################################################
//########################### icon button #################################################
//#########################################################################################
//#########################################################################################

// This function creates an icon element and returns it
function createIcon() {
  // Create an icon element
  let icon = document.createElement("img");
  // Set the source and alt of the icon
  icon.src = browser.runtime.getURL("icons/passwordPaintingIcon.png");
  icon.alt = "Paint your password";
  // Set the style of the icon
  icon.style.width = "24px";
  icon.style.height = "24px";
  icon.style.position = "absolute";
  icon.style.right = "35px";
  icon.style.top = "0px";
  // Return the icon element
  return icon;
}

// This function adds the icon to the password field
function addIconToPasswordField(passwordField) {
  // Get the parent element of the password field
  let parent = passwordField.parentElement;
  // Create the icon element
  let icon = createIcon();
  // Append the icon element to the parent element
  parent.appendChild(icon);
  //parent.style.overflow = "visible"; //this may be needed if the icon should be displayed right of the pw field, but it might have side effects
  
  // add onclick listener
  icon.addEventListener("click", function() {
    // Call the showModal function with the password field as a parameter
    showModal(passwordField);
  });
}

// This function finds all the password fields on the web page and adds the icon to them
function addIconToAllPasswordFields() {
  // Get all the input elements on the web page
  let inputs = document.getElementsByTagName("input");
  // Loop through the input elements
  for (let input of inputs) {
    // Check if the input element is a password field
    if (input.type === "password") {
      // Add the icon to the password field
      addIconToPasswordField(input);
    }
  }
}

//#########################################################################################
//#########################################################################################
//########################### modal window ################################################
//#########################################################################################
//#########################################################################################

// This function creates a modal element and returns it
function createModal() {
  // Create a modal element
  let modal = document.createElement("div");
  // Set the id and class of the modal
  modal.id = "myModal";
  modal.className = "modal";
  // Set the style of the modal
  modal.style.display = "none"; // Hidden by default
  modal.style.position = "fixed"; // Stay in place
  modal.style.zIndex = "1"; // Sit on top
  modal.style.left = "0";
  modal.style.top = "10%"; 
  modal.style.width = "100%"; // Full width
  modal.style.height = "100%"; // Full height
  modal.style.overflow = "auto"; // Enable scroll if needed
  modal.style.backgroundColor = "rgba(0,0,0,0.4)"; // Black with opacity
  // Return the modal element
  return modal;
}

// This function creates a modal content element and returns it
function createModalContent() {
  // Create a modal content element
  let modalContent = document.createElement("div");
  // Set the class of the modal content
  modalContent.className = "modal-content";
  // Set the style of the modal content
  modalContent.style.backgroundColor = "#fefefe";
  modalContent.style.display = "grid"
  modalContent.style.gridTemplateColumns = "65% 30% 5%"

  modalContent.style.margin = "auto"; // Centered
  modalContent.style.padding = "20px";
  modalContent.style.border = "1px solid #888";
  modalContent.style.width = "75%"; // 75% of the viewport width
  modalContent.style.height = "75vh"; // 75% of the viewport height

  // add grid to draw the password
  let grid = createGrid();
  modalContent.appendChild(grid);
  currentGrid = grid;

  modalContent.addEventListener("DOMContentLoaded", function() {
    addColorChangeToGrid();
  });

  // add color picker
  modalContent.appendChild(createColorPicker());
  
  // Return the modal content element
  return modalContent;
}

// This function creates a close button element and returns it
function createCloseButton() {
  // Create a close button element
  let closeButton = document.createElement("span");
  // Set the class and text of the close button
  closeButton.className = "close";
  closeButton.textContent = "×";
  // Set the style of the close button
  closeButton.style.color = "#aaa";
  closeButton.style.float = "right";
  closeButton.style.fontSize = "28px";
  closeButton.style.fontWeight = "bold";
  // Add a hover effect to the close button
  closeButton.addEventListener("mouseover", function() {
    closeButton.style.color = "black";
    closeButton.style.textDecoration = "none";
    closeButton.style.cursor = "pointer";
  });
  closeButton.addEventListener("mouseout", function() {
    closeButton.style.color = "#aaa";
  });
  // Return the close button element
  return closeButton;
}

  // This function creates a button element for the confirm button and returns it
  function createConfirmButton() {
    // Create a close button element
    let confirmbutton = document.createElement("span");
    // Set the class and text of the close button
    confirmbutton.className = "close";
    confirmbutton.textContent = "use as password";
    // Set the style of the button
    confirmbutton.style.width = "40vh";
    confirmbutton.style.height = "7vh";
    confirmbutton.style.fontSize = "4vh";
    confirmbutton.style.fontWeight = "bold";
    confirmbutton.style.color = "white";
    confirmbutton.style.backgroundColor = "green";
    confirmbutton.style.border = "none";
    confirmbutton.style.borderRadius = "1vh";
    confirmbutton.style.textAlign = "center";

    // Add a hover effect to the button
    confirmbutton.addEventListener("mouseover", function() {
      confirmbutton.style.color = "black";
      confirmbutton.style.textDecoration = "none";
      confirmbutton.style.cursor = "pointer";
    });
    confirmbutton.addEventListener("mouseout", function() {
      confirmbutton.style.color = "#aaa";
    });
    // Return the button element
    return confirmbutton;
  }

// This function adds the modal, the modal content, and the close button to the document body
function addModalToDocument() {
  // Create the modal, the modal content, the close button and confirm button elements
  let modal = createModal();
  let modalContent = createModalContent();
  let closeButton = createCloseButton();
  let confirmButton = createConfirmButton();
  // Append the buttons and the modal content to the modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(confirmButton);
  modal.appendChild(modalContent);

  // add button functionality
  addCloseToModal(modal, closeButton);
  addConfirmToModal(modal, confirmButton);

  // Append the modal to the document body
  document.body.appendChild(modal);
}

// This function shows the modal when the icon is clicked
function showModal(passwordField) {
  currentPasswordField = passwordField;
  // Get the modal element by its id
  let modal = document.getElementById("myModal");
  // Set the display property to block
  modal.style.display = "block";
}

// This function hides the modal when the close button or the overlay is clicked
function hideModal() {
  // Get the modal element by its id
  let modal = document.getElementById("myModal");
  // Set the display property to none
  modal.style.display = "none";
}

// This function adds the close feature to the modal
function addCloseToModal(modal, closeButton) {
  // Add a click event listener to the close button
  closeButton.addEventListener("click", hideModal);
}

// This function adds the confirm feature to the modal
function addConfirmToModal(modal, confirmButton) {
  // Add a click event listener to the confirm button
  confirmButton.addEventListener("click", function() {
    hideModal();
    setPassword();
  });
}

//#########################################################################################
//#########################################################################################
//########################### canvas ######################################################
//#########################################################################################
//#########################################################################################
  
// This function creates a square element and returns it
function createSquare() {
  // Create a square element
  let square = document.createElement("div");
  // Set the class of the square
  square.className = "square";
  // Set the style of the square
  square.style.width = "5vh";
  square.style.height = "5vh";
  square.style.border = "1px solid rgb(200,200,200)";
  square.style.backgroundColor = "rgb(255,255,255)";
  // Return the square element
  return square;
}

// This function creates a grid element and returns it
function createGrid() {
  // Create a grid element
  let grid = document.createElement("div");
  // Set the id and class of the grid
  grid.id = "grid";
  grid.className = "grid";
  // Set the style of the grid
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(12, 5vh)"; // 12 columns of 12px each
  grid.style.gridTemplateRows = "repeat(12, 5vh)"; // 12 rows of 12px each
  grid.addEventListener("mousedown", function(e) {
    e.preventDefault(); // prevent drag and drop
  });

  //grid.style.gap = "1px"; // 1px gap between squares
  // Return the grid element
  addSquaresToGrid(grid);
  addColorChangeToGrid(grid);

  return grid;
}

// This function adds the squares to the grid
function addSquaresToGrid(grid) {
  // Loop 144 times to create 144 squares
  for (let i = 0; i < 144; i++) {
    // Create a square element
    let square = createSquare();
    // Append the square element to the grid
    grid.appendChild(square);
  }
}

// This function changes the color of the square when the mouse is pressed down and is hovering over it
function changeColorOfSquare(event) {
  // Check if the mouse button is pressed
  if (event.buttons === 1) {
    // Get the target element of the event
    let target = event.target;
    // Check if the target element is a square
    if (target.className === "square") {
      // Set the background color of the square to a random color
      target.style.backgroundColor = selectedColor;
    }
  }
}

// This function adds the color change feature to the grid
function addColorChangeToGrid(grid) {
  // Add a mousemove event listener to the grid
  grid.addEventListener("mousemove", changeColorOfSquare);
}

//#########################################################################################
//#########################################################################################
//########################### color picker ################################################
//#########################################################################################
//#########################################################################################
  
// This function creates a color picker element and returns it
function createColorPicker() {
  let colorPickerContainer = document.createElement("div");

  let colorPickerText = document.createElement("div");
  colorPickerText.textContent = "choose color";

  // Create a color picker element
  let colorPicker = document.createElement("input");
  // Set the type and value of the color picker
  colorPicker.type = "color";
  colorPicker.value = "#000000"; // Default value is black

  // Set the style of the color picker
  colorPicker.style.width = "20vh";
  colorPicker.style.height = "20vh";
  colorPicker.style.border = "none";
  colorPicker.style.borderRadius = "50%";

  colorPicker.addEventListener("change", updateSelectedColor);

  colorPickerContainer.appendChild(colorPickerText);
  colorPickerContainer.appendChild(colorPicker);

  // Return the color picker element
  return colorPickerContainer;
}

// This function updates the selected color
function updateSelectedColor(event) {
  // Get the target element of the event
  let target = event.target;
  // Check if the target element is the color picker or the color element
  if (target.type === "color" || target.className === "color") {
    // Get the color value from the target element
    let color = target.value || target.style.backgroundColor;
    // Update the global variable with the color value
    selectedColor = color;
    // Log the selected color to the console
    console.log("Selected color: " + selectedColor);
  }
}

//#########################################################################################
//#########################################################################################
//########################### crypto stuff ################################################
//#########################################################################################
//#########################################################################################
  
// this function transforms the painting into a passwrd and sets it in the input element
function setPassword() {
  // string that is filled with all the data from the painting
  let rawDataString = "";

  let children = currentGrid.childNodes;
  for (let i = 0; i < children.length; i++) {
    // just add the color of each pixel to the string  
    rawDataString += children[i].style.backgroundColor;
  }

  // then use sha256 to hash this raw data
  digestMessage(rawDataString).then(digestBuffer => {
    // use result as byte array
    let byteArray = new Uint8Array(digestBuffer);
    let generatedPassword = "";
    for (let i = 0; i < byteArray.length; i++) {
      // use bytes of byte array to select character from string of possible characters
      // since the byte can hold numbers up to 255 and we only have 95 possible pw characters defined, just use modulo to deal with the overflow
      //    this is not ideal as the characters are not evenly distributed, but considering the overall length (32) of the generated password it probably is sufficient
      generatedPassword += pwCharacters[byteArray[i]%pwCharacters.length];
    }
    currentPasswordField.value = generatedPassword;
  });
}

// sha256
async function digestMessage(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return hash;
}