document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const signupForm = document.getElementById("signup-form");
  const activitySelect = document.getElementById("activity-select");
  const emailInput = document.getElementById("email");
  const messageDiv = document.getElementById("message");

  // Fetch and display activities
  fetch("/activities")
    .then((res) => res.json())
    .then((data) => {
      // Populate activity select dropdown
      for (const name in data) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      }
      // Display activities
      for (const name in data) {
        const activity = data[name];
        const div = document.createElement("div");
        div.className = "activity";
        // Create participants list HTML
        const participantsList = activity.participants.length
          ? `<ul class="participants-list">
                ${activity.participants
                  .map(
                    (email) =>
                      `<li class="participant-item"><span class="participant-email">${email}</span></li>`
                  )
                  .join("")}
             </ul>`
          : `<p class="no-participants">No participants yet.</p>`;
        div.innerHTML = `
          <h3>${name}</h3>
          <p>${activity.description}</p>
          <p><strong>Schedule:</strong> ${activity.schedule}</p>
          <p><strong>Participants:</strong> ${activity.participants.length}/${activity.max_participants}</p>
          <div class="participants-section">
            <strong>Signed Up:</strong>
            ${participantsList}
          </div>
        `;
        activitiesList.appendChild(div);
      }
    });

  // Handle signup form submission
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const activity = activitySelect.value;
    const email = emailInput.value;
    messageDiv.textContent = "";
    fetch(
      `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
      }
    )
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || data.message);
        messageDiv.textContent = data.message;
        messageDiv.className = "success";
      })
      .catch((err) => {
        messageDiv.textContent = err.message;
        messageDiv.className = "error";
      });
  });
});
