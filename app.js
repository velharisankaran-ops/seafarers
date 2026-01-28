const SUPABASE_URL = "https://girfsumcqkmokvqjozrm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpcmZzdW1jcWttb2t2cWpvenJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODA5OTgsImV4cCI6MjA4NTE1Njk5OH0.Tzyry76B31KEdXupQ_TUt7TAMVhO-2DZd-xNd1-wsUc";

async function loadSeafarers() {
  try {
    // Fetch all public seafarers
    const res = await fetch(`${SUPABASE_URL}/rest/v1/seafarers?select=seafarer_id,full_name,rank,nationality,total_experience_years,availability_date&visibility=eq.Public`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const seafarers = await res.json();
    const container = document.getElementById("seafarers");

    if (seafarers.length === 0) {
      container.innerHTML = "<p>No public seafarers available</p>";
      return;
    }

    for (const s of seafarers) {
      // Fetch certificates for each seafarer
      const certRes = await fetch(`${SUPABASE_URL}/rest/v1/certificates?select=certificate_name,certificate_no,issuing_authority,issue_date,expiry_date&seafarer_id=eq.${s.seafarer_id}&is_public=eq.true`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      });
      const certificates = await certRes.json();

      // Fetch sea experience
      const expRes = await fetch(`${SUPABASE_URL}/rest/v1/sea_experience?select=vessel_name,rank,vessel_type,grt_nrt,sign_on,sign_off,company&seafarer_id=eq.${s.seafarer_id}`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      });
      const experience = await expRes.json();

      // Create card
      let cardHTML = `
        <div class="card">
          <h3>${s.full_name}</h3>
          <p><b>Rank:</b> ${s.rank}</p>
          <p><b>Nationality:</b> ${s.nationality}</p>
          <p><b>Experience:</b> ${s.total_experience_years || 0} yrs</p>
          <p><b>Available From:</b> ${s.availability_date || 'Immediate'}</p>
      `;

      if (certificates.length > 0) {
        cardHTML += `<div class="section-title">Certificates / Trainings</div><ul>`;
        certificates.forEach(c => {
          cardHTML += `<li>${c.certificate_name} (${c.issuing_authority})</li>`;
        });
        cardHTML += `</ul>`;
      }

      if (experience.length > 0) {
        cardHTML += `<div class="section-title">Sea Experience</div><ul>`;
        experience.forEach(e => {
          cardHTML += `<li>${e.vessel_name} - ${e.rank} (${e.vessel_type})</li>`;
        });
        cardHTML += `</ul>`;
      }

      cardHTML += `</div>`; // close card
      container.innerHTML += cardHTML;
    }

  } catch (err) {
    console.error("Failed to load seafarers:", err);
    document.getElementById("seafarers").innerHTML = "<p>Error loading seafarers</p>";
  }
}

loadSeafarers();
