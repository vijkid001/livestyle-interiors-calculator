const pricing = {
  Ultra: {
    plywood: 200, laminate: 60, acrylic: 190, glass: 300,
    wardrobeSqft: 1800, kitchenSqft: 2200, tvUnitSqft: 1500, mandirCost: 45000,
    falseCeilingSqft: 140, electricalPoint: 1200, paintingSqft: 45, sofaPerSeat: 18000, dining6Seater: 75000, bedWithStorage: 45000
  },
  Good: {
    plywood: 100, laminate: 46, acrylic: 140, glass: 250,
    wardrobeSqft: 1300, kitchenSqft: 1600, tvUnitSqft: 1100, mandirCost: 28000,
    falseCeilingSqft: 110, electricalPoint: 900, paintingSqft: 32, sofaPerSeat: 12000, dining6Seater: 45000, bedWithStorage: 30000
  },
  Economy: {
    plywood: 70, laminate: 30, acrylic: 93, glass: 200,
    wardrobeSqft: 950, kitchenSqft: 1200, tvUnitSqft: 800, mandirCost: 18000,
    falseCeilingSqft: 90, electricalPoint: 650, paintingSqft: 22, sofaPerSeat: 8000, dining6Seater: 28000, bedWithStorage: 20000
  }
};

const labourRate = 240;

function toggleSections() {
  const type = document.getElementById("calcType").value;
  if (type === "default") {
    document.getElementById("defaultSection").classList.remove("hidden");
    document.getElementById("customSection").classList.add("hidden");
  } else {
    document.getElementById("customSection").classList.remove("hidden");
    document.getElementById("defaultSection").classList.add("hidden");
  }
}

function generateRooms() {
  const roomCount = parseInt(document.getElementById("roomCount").value) || 0;
  const container = document.getElementById("roomsContainer");
  container.innerHTML = "";

  for (let i = 1; i <= roomCount; i++) {
    const roomDiv = document.createElement("div");
    roomDiv.className = "room-box";
    roomDiv.innerHTML = `
      <h3>Room ${i}</h3>
      <label>How Many Woodwork Parts (Wardrobe, TV Unit, Panel)?</label>
      <input type="number" min="1" id="parts_${i}" onchange="generateParts(${i})">
      <div id="partsContainer_${i}"></div>
    `;
    container.appendChild(roomDiv);
  }
}

function generateParts(roomNumber) {
  const partCount = parseInt(document.getElementById(`parts_${roomNumber}`).value) || 0;
  const container = document.getElementById(`partsContainer_${roomNumber}`);
  container.innerHTML = "";

  for (let j = 1; j <= partCount; j++) {
    const partDiv = document.createElement("div");
    partDiv.className = "part-box";
    partDiv.innerHTML = `
      <h4>Room ${roomNumber} - Part ${j}</h4>
      <div class="row">
        <div>
          <label>Height (ft)</label>
          <input type="number" id="height_${roomNumber}_${j}">
        </div>
        <div>
          <label>Width (ft)</label>
          <input type="number" id="width_${roomNumber}_${j}">
        </div>
      </div>
      <label>Laminate %</label>
      <input type="number" id="laminate_${roomNumber}_${j}" value="50">
      <label>Acrylic %</label>
      <input type="number" id="acrylic_${roomNumber}_${j}" value="30">
      <label>Glass %</label>
      <input type="number" id="glass_${roomNumber}_${j}" value="20">
    `;
    container.appendChild(partDiv);
  }
}

function isChecked(id) {
  const el = document.getElementById(id);
  return el ? el.checked : false;
}

function calculateEstimate() {
  const type = document.getElementById("calcType").value;
  let totalSqft = 0;
  let materialCost = 0;
  let additionalTotal = 0;
  let breakdownHTML = "";

  const bhk = parseInt(document.getElementById("bhkType") ? document.getElementById("bhkType").value : 3) || 3;
  const materialType = document.getElementById(type === "default" ? "defaultMaterial" : "customMaterial").value;
  const tier = pricing[materialType];

  if (type === "default") {
    // 1. Bedroom Wardrobes Scope
    if (isChecked("incWardrobes")) {
      const wardrobeSqft = bhk * 80;
      const wardrobeCost = wardrobeSqft * tier.wardrobeSqft;
      totalSqft += wardrobeSqft;
      materialCost += wardrobeCost;

      breakdownHTML += `
        <div class="breakdown-card">
          <h3>1. Bedroom Wardrobes & Lofts</h3>
          <p>Quantity: ${bhk} Wardrobes (${wardrobeSqft} Sq Ft Total)</p>
          <p>Rate: ₹${tier.wardrobeSqft} / Sq Ft</p>
          <p><strong>Subtotal: ₹${wardrobeCost.toFixed(2)}</strong></p>
        </div>
      `;
    }

    // 2. Modular Kitchen Scope
    if (isChecked("incKitchen")) {
      const kitchenSqft = bhk === 2 ? 80 : (bhk === 3 ? 100 : 130);
      const kitchenCost = kitchenSqft * tier.kitchenSqft;
      totalSqft += kitchenSqft;
      materialCost += kitchenCost;

      breakdownHTML += `
        <div class="breakdown-card">
          <h3>2. Modular Kitchen Setup</h3>
          <p>Base & Wall Cabinets: ${kitchenSqft} Sq Ft</p>
          <p>Rate: ₹${tier.kitchenSqft} / Sq Ft</p>
          <p><strong>Subtotal: ₹${kitchenCost.toFixed(2)}</strong></p>
        </div>
      `;
    }

    // 3. Living Room TV Unit Scope
    if (isChecked("incTVUnit")) {
      const tvUnitSqft = 45;
      const tvUnitCost = tvUnitSqft * tier.tvUnitSqft;
      totalSqft += tvUnitSqft;
      materialCost += tvUnitCost;

      breakdownHTML += `
        <div class="breakdown-card">
          <h3>3. Living Room TV Unit & Wall Panel</h3>
          <p>Dimensions: 45 Sq Ft Panel & Floating Storage</p>
          <p><strong>Subtotal: ₹${tvUnitCost.toFixed(2)}</strong></p>
        </div>
      `;
    }

    // 4. Mandir / Pooja Unit Scope
    if (isChecked("incPooja")) {
      additionalTotal += tier.mandirCost;
      breakdownHTML += `
        <div class="breakdown-card">
          <h3>4. Pooja Unit / Mandir</h3>
          <p>Custom Woodwork / CNC Jali Setup</p>
          <p><strong>Subtotal: ₹${tier.mandirCost.toFixed(2)}</strong></p>
        </div>
      `;
    }

    // 5. False Ceiling Scope
    if (isChecked("incFalseCeiling")) {
      const ceilingArea = (bhk * 350) * 0.75;
      const ceilingCost = ceilingArea * tier.falseCeilingSqft;
      additionalTotal += ceilingCost;

      breakdownHTML += `
        <div class="breakdown-card">
          <h3>5. POP / Gypsum False Ceiling</h3>
          <p>Area: ${ceilingArea.toFixed(0)} Sq Ft (Living, Dining, Bedrooms)</p>
          <p><strong>Subtotal: ₹${ceilingCost.toFixed(2)}</strong></p>
        </div>
      `;
    }

    // 6. Painting & Wallpaper
    if (isChecked("incPainting")) {
      const wallArea = (bhk * 350) * 3;
      const paintingCost = wallArea * tier.paintingSqft;
      additionalTotal += paintingCost;

      breakdownHTML += `
        <div class="breakdown-card">
          <h3>6. Painting & Wall Finishes</h3>
          <p>Complete Emulsion Wall Paint: ₹${paintingCost.toFixed(2)}</p>
        </div>
      `;
    }

    // 7. Electrical Point Modifications
    if (isChecked("incElectrical")) {
      const elecPoints = bhk * 15;
      const elecCost = elecPoints * tier.electricalPoint;
      additionalTotal += elecCost;

      breakdownHTML += `
        <div class="breakdown-card">
          <h3>7. Electrical Point Modifications</h3>
          <p>Added/Shifted Points: ${elecPoints} Points</p>
          <p><strong>Subtotal: ₹${elecCost.toFixed(2)}</strong></p>
        </div>
      `;
    }

    // 8. Loose Furniture Scope
    if (isChecked("incFurniture")) {
      const furnitureCost = (tier.sofaPerSeat * 5) + tier.dining6Seater + (tier.bedWithStorage * bhk);
      additionalTotal += furnitureCost;

      breakdownHTML += `
        <div class="breakdown-card">
          <h3>8. Loose Furniture (Sofa, Dining, Beds)</h3>
          <p>Includes 5-Seater Sofa, 6-Seater Dining, and ${bhk} Storage Beds</p>
          <p><strong>Subtotal: ₹${furnitureCost.toFixed(2)}</strong></p>
        </div>
      `;
    }

  } else {
    // Custom calculation logic based on generated room inputs
    const roomCount = parseInt(document.getElementById("roomCount").value) || 0;
    for (let i = 1; i <= roomCount; i++) {
      const partCount = parseInt(document.getElementById(`parts_${i}`).value) || 0;
      for (let j = 1; j <= partCount; j++) {
        const height = parseFloat(document.getElementById(`height_${i}_${j}`).value) || 0;
        const width = parseFloat(document.getElementById(`width_${i}_${j}`).value) || 0;
        const frontArea = height * width;
        totalSqft += frontArea;
        materialCost += (frontArea * tier.wardrobeSqft);

        breakdownHTML += `
          <div class="breakdown-card">
            <h4>Room ${i} - Part ${j}</h4>
            <p>Dimensions: ${height} ft × ${width} ft = ${frontArea.toFixed(2)} Sq Ft</p>
            <p><strong>Subtotal: ₹${(frontArea * tier.wardrobeSqft).toFixed(2)}</strong></p>
          </div>
        `;
      }
    }
  }

  const labourCost = totalSqft * labourRate;
  const grandTotal = materialCost + labourCost + additionalTotal;

  document.getElementById("totalSqft").innerText = totalSqft.toFixed(2);
  document.getElementById("materialCost").innerText = materialCost.toFixed(2);
  document.getElementById("labourCost").innerText = labourCost.toFixed(2);
  document.getElementById("totalCost").innerText = grandTotal.toFixed(2);
  document.getElementById("calculationBreakdown").innerHTML = breakdownHTML;
}

// Global Visit Counter using CounterAPI
// Local & Reliable Visit Counter
(function trackVisits() {
  let visits = parseInt(localStorage.getItem("livestyle_visits") || "0");
  visits += 1;
  localStorage.setItem("livestyle_visits", visits);
  
  const countElement = document.getElementById("visitCount");
  if (countElement) {
    countElement.innerText = visits.toLocaleString();
  }
})();