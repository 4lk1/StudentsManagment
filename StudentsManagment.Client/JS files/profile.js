function openProfilePopup() {
  const userData = JSON.parse(localStorage.getItem("signupData"));
  if (!userData) {
      alert("Please log in first.");
      return;
  }

  document.getElementById("popupUsername").textContent = userData.username;
  document.getElementById("popupEmail").textContent = userData.email;
  document.getElementById("profilePopup").classList.remove("hidden");
}

function closeProfilePopup() {
  document.getElementById("profilePopup").classList.add("hidden");
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("signupData");
  window.location.href = "login.html";
}

async function deleteAccount() {
  if (confirm("Are you sure you want to delete your account?")) {
      const token = localStorage.getItem("token");
      try {
          const response = await fetch('/api/auth/delete-account', {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error("Failed to delete account");
          localStorage.removeItem("signupData");
          localStorage.removeItem("token");
          alert("Account deleted.");
          window.location.href = "sgnup.html";
      } catch (error) {
          console.error('Error deleting account:', error);
          alert("Failed to delete account.");
      }
  }
}