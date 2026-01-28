const SUPABASE_URL = "https://girfsumcqkmokvqjozrm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpcmZzdW1jcWttb2t2cWpvenJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODA5OTgsImV4cCI6MjA4NTE1Njk5OH0.Tzyry76B31KEdXupQ_TUt7TAMVhO-2DZd-xNd1-wsUc";

async function loadSeafarers() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/seafarers?select=seafarer_id,full_name,rank,nationality,total_experience_years&visibility=eq.Public`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const data = await response.json();
    const container = document.getElementById("seafarers");

    if (data.length === 0) {
      container.innerHTML = "<p>No public seafarers available</p>";
      return;
    }

    data.forEach(s => {
      container.innerHTML += `
        <div class="card">
          <h3>${s.full_name}</h3>
          <p><b>Rank:</b> ${s.rank}</p>
          <p><b>Nationality:</b> ${s.nationality}</p>
          <p><b>Experience:</b> ${s.total_experience_years || 0} yrs</p>
          <a href="profile.html?id=${s.seafarer_id}">View Profile</a>
        </div>
      `;
    });

  } catch (err) {
    console.error("Failed to load seafarers:", err);
    document.getElementById("seafarers").innerHTML = "<p>Error loading seafarers</p>";
  }
}

loadSeafarers();
