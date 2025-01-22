const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("file");
const loadingContainer = document.getElementById("loading");
const loadingMessage = document.getElementById("loadingMessage");

const loadingMessages = [
  "Reading your resume...",
  "Identifying key words...",
  "Analyzing your skills...",
  "You are seconds away from your dream job😉",
  "Fetching the right job for you...",
];

let messageIndex = 0;

uploadButton.addEventListener("click", () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file first!");
    return;
  }
  loadingContainer.style.display = "flex";
  messageIndex = 0; // Reset message index when a new upload is started
  loadingMessage.textContent = loadingMessages[messageIndex]; // Show the first message immediately

  // Update message every 2 seconds
  messageInterval = setInterval(() => {
    messageIndex++;
    if (messageIndex < loadingMessages.length) {
      loadingMessage.textContent = loadingMessages[messageIndex];
    } else {
      clearInterval(messageInterval); // Stop updating once the last message is displayed
    }
  }, 2000);
  // Create FormData to hold the file
  const formData = new FormData();
  formData.append("file", file);

  // Send the file to the server
  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      setTimeout(() => {
        // Clear the loading container and stop the spinner
        loadingContainer.style.display = "none";

        if (data.job_category) {
          document.getElementById("result").textContent =
            "Predicted Job type:  " + data.job_category;
        } else {
          document.getElementById("result").textContent =
            "Error: No job category found";
          document.getElementById("result").style.color = "red";
        }
      }, loadingMessages.length * 2000);
    })
    .catch((error) => {
      loadingContainer.style.display = "none";
      document.getElementById("result").textContent =
        "Error occurred during the prediction process.";
      document.getElementById("result").style.color = "red";
    });
});
