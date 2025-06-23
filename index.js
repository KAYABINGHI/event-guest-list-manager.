// Get the form, input, select, and list elements from the HTML
const guestForm = document.getElementById("guest-form")
const guestNameInput = document.getElementById("guest-name")
const guestCategorySelect = document.getElementById("guest-category")
const guestList = document.getElementById("guest-list")
const totalCountDisplay = document.getElementById("totalCount")
const rsvpCountDisplay = document.getElementById("rsvpCount")
const guestListTitle = document.getElementById("guest-list-title")

// Keep track of guests
let guestCount = 0
let rsvpCount = 0
const maxGuests = 10

// Add event listener for form submission
guestForm.addEventListener("submit", handleFormSubmit)

// Function to handle form submission
function handleFormSubmit(event) {
  // Stop the page from refreshing
  event.preventDefault()

  // Get the name and category entered by the user
  const guestName = guestNameInput.value.trim()
  const guestCategory = guestCategorySelect.value

  // Log for debugging (helpful for learning!)
  console.log(`Submitting form. Current guest count: ${guestCount}`)

  // Validate input - make sure name isn't empty
  if (!guestName) {
    alert("Please enter a guest name!")
    console.log("Empty name entered, showing alert.")
    return
  }

  // Check if guest already exists
  if (isGuestAlreadyAdded(guestName)) {
    alert("This guest is already on the list!")
    return
  }

  // Check guest limit
  if (guestCount >= maxGuests) {
    alert(`Sorry, the guest list is full! Only ${maxGuests} guests allowed.`)
    console.log(`Guest limit reached (${maxGuests} guests).`)
    return
  }

  // Add guest to the list
  addGuestToList(guestName, guestCategory)

  // Clear the input field for next entry
  guestNameInput.value = ""

  // Reset select to first option
  guestCategorySelect.selectedIndex = 0

  console.log(`Added ${guestName} as ${guestCategory}. Total guests: ${guestCount}`)
}

// Function to check if guest already exists
function isGuestAlreadyAdded(name) {
  const existingGuests = document.querySelectorAll(".guest-name")
  for (const guest of existingGuests) {
    if (guest.textContent.toLowerCase() === name.toLowerCase()) {
      return true
    }
  }
  return false
}

// Function to add a guest to the list
function addGuestToList(name, category) {
  // Create a new list item element
  const listItem = document.createElement("li")

  // Set initial RSVP status
  listItem.dataset.rsvpStatus = "pending"

  // Create the HTML content for the list item
  listItem.innerHTML = `
    <span class="guest-name">${name}</span>
    <span class="category ${category.toLowerCase()}">${category}</span>
    <span class="rsvp" title="Click to change RSVP status">RSVP: Pending</span>
    <button class="remove-btn" title="Remove guest">Remove</button>
  `

  // Add remove button functionality
  const removeButton = listItem.querySelector(".remove-btn")
  removeButton.addEventListener("click", () => {
    // Check if guest was attending before removing
    const wasAttending = listItem.dataset.rsvpStatus === "attending"

    // Remove the guest from the list
    listItem.remove()
    guestCount--

    // Update RSVP count if they were attending
    if (wasAttending) {
      rsvpCount--
    }

    // Update displays
    updateCounters()

    console.log(`Removed ${name}. Total guests: ${guestCount}`)
  })

  // Add RSVP toggle functionality
  const rsvpSpan = listItem.querySelector(".rsvp")
  rsvpSpan.addEventListener("click", () => {
    // Cycle through RSVP statuses: pending -> attending -> not-attending -> pending
    const currentStatus = listItem.dataset.rsvpStatus
    let newStatus, newText, newClass

    switch (currentStatus) {
      case "pending":
        newStatus = "attending"
        newText = "RSVP: Yes"
        newClass = "attending"
        rsvpCount++
        break
      case "attending":
        newStatus = "not-attending"
        newText = "RSVP: No"
        newClass = "not-attending"
        rsvpCount--
        break
      case "not-attending":
        newStatus = "pending"
        newText = "RSVP: Pending"
        newClass = ""
        break
    }

    // Update the status
    listItem.dataset.rsvpStatus = newStatus
    rsvpSpan.textContent = newText

    // Update CSS classes
    rsvpSpan.className = `rsvp ${newClass}`

    // Update counter display
    updateCounters()

    console.log(`${name} RSVP changed to: ${newStatus}`)
  })

  // Add the new guest to the list
  guestList.appendChild(listItem)
  guestCount++

  // Update the counter displays
  updateCounters()

  console.log(`Added ${name}. Total guests in DOM: ${guestList.children.length}`)
}

// Function to update all counter displays
function updateCounters() {
  // Update total count
  totalCountDisplay.textContent = guestCount

  // Update RSVP count
  rsvpCountDisplay.textContent = rsvpCount

  // Update guest list title
  guestListTitle.textContent = `Guest List (${guestCount}/${maxGuests})`

  // Change title color based on capacity
  if (guestCount >= maxGuests) {
    guestListTitle.style.color = "#f44336" // Red when full
  } else if (guestCount >= maxGuests * 0.8) {
    guestListTitle.style.color = "#ff9800" // Orange when nearly full
  } else {
    guestListTitle.style.color = "#373748" // Default color
  }
}

// Initialize counters on page load
updateCounters()
// Log success message to console
console.log("Guest List Manager loaded successfully!")
console.log("Try adding guests and clicking on RSVP status to see how it works!")
