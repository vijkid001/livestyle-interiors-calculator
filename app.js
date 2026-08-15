const pricing = {

    Ultra:{
      plywood:150,
      laminate:60,
      acrylic:190,
      glass:300
    },

    Good:{
      plywood:100,
      laminate:46,
      acrylic:140,
      glass:250
    },

    Economy:{
      plywood:70,
      laminate:31,
      acrylic:93,
      glass:200
    }

  };

  const labourRate = 240;

  const channelConfig = {

    Ultra:8,
    Good:4,
    Economy:2

  };

  const channelRate = 1500;

  const miscRate = 40;

  function toggleSections(){

    const type =
      document.getElementById("calcType").value;

    if(type === "default"){

      document
      .getElementById("defaultSection")
      .classList.remove("hidden");

      document
      .getElementById("customSection")
      .classList.add("hidden");

    }
    else{

      document
      .getElementById("customSection")
      .classList.remove("hidden");

      document
      .getElementById("defaultSection")
      .classList.add("hidden");

    }

  }

  function generateRooms(){

    const roomCount =
      parseInt(
        document.getElementById("roomCount").value
      );

    const container =
      document.getElementById("roomsContainer");

    container.innerHTML = "";

    for(let i=1;i<=roomCount;i++){

      const roomDiv =
        document.createElement("div");

      roomDiv.className = "room-box";

      roomDiv.innerHTML = `

        <h3>Room ${i}</h3>

        <label>How Many Parts?</label>

        <input
          type="number"
          min="1"
          id="parts_${i}"
          onchange="generateParts(${i})"
        >

        <div id="partsContainer_${i}"></div>

      `;

      container.appendChild(roomDiv);

    }

  }

  function generateParts(roomNumber){

    const partCount =
      parseInt(
        document.getElementById(`parts_${roomNumber}`).value
      );

    const container =
      document.getElementById(`partsContainer_${roomNumber}`);

    container.innerHTML = "";

    for(let j=1;j<=partCount;j++){

      const partDiv =
        document.createElement("div");

      partDiv.className = "part-box";

      partDiv.innerHTML = `

        <h4>Room ${roomNumber} - Part ${j}</h4>

        <div class="row">

          <div>

            <label>Height (ft)</label>

            <input
              type="number"
              id="height_${roomNumber}_${j}"
            >

          </div>

          <div>

            <label>Width (ft)</label>

            <input
              type="number"
              id="width_${roomNumber}_${j}"
            >

          </div>

        </div>

        <label>Acrylic %</label>

        <input
          type="number"
          id="acrylic_${roomNumber}_${j}"
          value="30"
        >

        <label>Glass %</label>

        <input
          type="number"
          id="glass_${roomNumber}_${j}"
          value="20"
        >

        <label>Laminate %</label>

        <input
          type="number"
          id="laminate_${roomNumber}_${j}"
          value="50"
        >

      `;

      container.appendChild(partDiv);

    }

  }

  function getBaseArea(bhk){

    if(bhk == 2){
      return 220;
    }
    else if(bhk == 3){
      return 320;
    }
    else if(bhk == 4){
      return 450;
    }
    else if(bhk == 5){
      return 600;
    }
    else{
      return 900;
    }

  }
  
  function getKitchenArea(bhk){

  if(bhk == 2) return 80;
  if(bhk == 3) return 100;
  if(bhk == 4) return 120;
  if(bhk == 5) return 140;

  return 180;

	}

  function getMultiplier(materialType){

    if(materialType === "Ultra"){
      return 3.5;
    }
    else if(materialType === "Good"){
      return 2.8;
    }
    else{
      return 2.2;
    }

  }

  function getHardwareRate(materialType){

    if(materialType === "Ultra"){
      return 600;
    }
    else if(materialType === "Good"){
      return 350;
    }
    else{
      return 180;
    }

  }

  function calculateEstimate(){

    const type =
      document.getElementById("calcType").value;

    let totalSqft = 0;
    let materialCost = 0;
    let breakdownHTML = "";
    let kitchenIncluded = "no";

    // DEFAULT

    if(type === "default"){

      const bhk =
        parseInt(
          document.getElementById("bhkType").value
        );

      const materialType =
        document.getElementById("defaultMaterial").value;

      const laminatePercent =
        parseFloat(
          document.getElementById("defaultLaminate").value
        );

      const acrylicPercent =
        parseFloat(
          document.getElementById("defaultAcrylic").value
        );

      const glassPercent =
        parseFloat(
          document.getElementById("defaultGlass").value
        );

      let baseArea =
		  getBaseArea(bhk);

		kitchenIncluded =
		document.querySelector(
		'input[name="defaultKitchen"]:checked'
		).value;

		if(kitchenIncluded === "yes"){
		  baseArea += getKitchenArea(bhk);
		}

      totalSqft = baseArea;

      const rate =
        pricing[materialType];

      const multiplier =
        getMultiplier(materialType);

      const plywoodArea =
        baseArea * multiplier;

      const plywoodCost =
        plywoodArea * rate.plywood;

      const laminateCost =
        baseArea *
        (laminatePercent/100) *
        rate.laminate;

      // DOUBLE ACRYLIC LAYER LOGIC

      const acrylicCost =
        (baseArea * 2) *
        (acrylicPercent/100) *
        rate.acrylic;

      const glassCost =
        baseArea *
        (glassPercent/100) *
        rate.glass;

      // HARDWARE

      const hardwareRate =
        getHardwareRate(materialType);

      const hardwareCost =
        baseArea * hardwareRate;

      // CHANNELS

      const wardrobes =
        Math.ceil(baseArea / 64);

      const channels =
        wardrobes *
        channelConfig[materialType];

      const channelCost =
        channels * channelRate;

      // MISC

      const miscCost =
        plywoodArea * miscRate;

      materialCost =

        plywoodCost +
        laminateCost +
        acrylicCost +
        glassCost +
        hardwareCost +
        channelCost +
        miscCost;

      breakdownHTML += `

        <div class="breakdown-card">

          <h3>Default Estimation Breakdown</h3>

          <p>
          House Type:
          ${bhk} BHK
          </p>

          <p>
          Estimated Woodwork Frontage:
          ${baseArea} Sq Ft
          </p>

          <p>
          Structural Area:
          ${baseArea}
          × ${multiplier}
          = ${plywoodArea.toFixed(2)} Sq Ft
          </p>

          <hr>

          <p>
          Plywood:
          ₹${plywoodCost.toFixed(2)}
          </p>

          <p>
          Laminate:
          ₹${laminateCost.toFixed(2)}
          </p>

          <p>
          Acrylic:
          ₹${acrylicCost.toFixed(2)}
          </p>

          <p>
          Glass:
          ₹${glassCost.toFixed(2)}
          </p>

          <p>
          Hardware:
          ₹${hardwareCost.toFixed(2)}
          </p>

          <p>
          Soft Close Channels:
          ₹${channelCost.toFixed(2)}
          </p>

          <p>
          Misc:
          ₹${miscCost.toFixed(2)}
          </p>

        </div>

      `;

    }

    // CUSTOM

    else{

      const roomCount =
        parseInt(
          document.getElementById("roomCount").value
        );

	  kitchenIncluded =
		document.querySelector(
		'input[name="customKitchen"]:checked'
		).value;

      const materialType =
        document.getElementById("customMaterial").value;

      const rate =
        pricing[materialType];

      const multiplier =
        getMultiplier(materialType);

      const hardwareRate =
        getHardwareRate(materialType);

      for(let i=1;i<=roomCount;i++){

        const partCount =
          parseInt(
            document.getElementById(`parts_${i}`).value
          );

        breakdownHTML += `
          <h3 style="margin-top:20px;">
            Room ${i}
          </h3>
        `;

        for(let j=1;j<=partCount;j++){

          const height =
            parseFloat(
              document.getElementById(`height_${i}_${j}`).value
            ) || 0;

          const width =
            parseFloat(
              document.getElementById(`width_${i}_${j}`).value
            ) || 0;

          const acrylic =
            parseFloat(
              document.getElementById(`acrylic_${i}_${j}`).value
            ) || 0;

          const glass =
            parseFloat(
              document.getElementById(`glass_${i}_${j}`).value
            ) || 0;

          const laminate =
            parseFloat(
              document.getElementById(`laminate_${i}_${j}`).value
            ) || 0;

          const frontArea =
            height * width;

          totalSqft += frontArea;

          const plywoodArea =
            frontArea * multiplier;

          const plywoodCost =
            plywoodArea * rate.plywood;

          const laminateCost =
            frontArea *
            (laminate/100) *
            rate.laminate;

          const acrylicCost =
            (frontArea * 2) *
            (acrylic/100) *
            rate.acrylic;

          const glassCost =
            frontArea *
            (glass/100) *
            rate.glass;

          const hardwareCost =
            frontArea *
            hardwareRate;

          const wardrobes =
            Math.max(
              1,
              Math.ceil(frontArea / 64)
            );

          const channels =
            wardrobes *
            channelConfig[materialType];

          const channelCost =
            channels * channelRate;

          const miscCost =
            plywoodArea * miscRate;

          const totalPartCost =

            plywoodCost +
            laminateCost +
            acrylicCost +
            glassCost +
            hardwareCost +
            channelCost +
            miscCost;

          materialCost += totalPartCost;

          breakdownHTML += `

            <div class="breakdown-card">

              <h4>Part ${j}</h4>

              <p>
              Dimensions:
              ${height} ft × ${width} ft
              = ${frontArea.toFixed(2)} Sq Ft
              </p>

              <p>
              Structural Area:
              ${frontArea.toFixed(2)}
              × ${multiplier}
              = ${plywoodArea.toFixed(2)} Sq Ft
              </p>

              <hr>

              <p>
              Plywood:
              ₹${plywoodCost.toFixed(2)}
              </p>

              <p>
              Laminate:
              ₹${laminateCost.toFixed(2)}
              </p>

              <p>
              Acrylic:
              ₹${acrylicCost.toFixed(2)}
              </p>

              <p>
              Glass:
              ₹${glassCost.toFixed(2)}
              </p>

              <p>
              Hardware:
              ₹${hardwareCost.toFixed(2)}
              </p>

              <p>
              Soft Close Channels:
              ₹${channelCost.toFixed(2)}
              </p>

              <p>
              Misc:
              ₹${miscCost.toFixed(2)}
              </p>

              <hr>

              <p>
              <strong>
              Part Total:
              ₹${totalPartCost.toFixed(2)}
              </strong>
              </p>

            </div>

          `;

        }

      }

    }

    if(type === "custom" && kitchenIncluded === "yes"){

	  const materialType =
	  document.getElementById("customMaterial").value;

	  const rate =
	  pricing[materialType];

	  const kitchenFrontArea = 80;

	  const kitchenStructure =
	  kitchenFrontArea * 4;

	  const kitchenPlywood =
	  kitchenStructure * rate.plywood;

	  const kitchenHardware =
	  kitchenFrontArea *
	  getHardwareRate(materialType);

	  const kitchenMisc =
	  kitchenStructure *
	  miscRate;

	  const kitchenCost =
	  kitchenPlywood +
	  kitchenHardware +
	  kitchenMisc;

	  materialCost += kitchenCost;

	  totalSqft += kitchenFrontArea;

	  breakdownHTML += `

	  <div class="breakdown-card">

		<h3>Kitchen Estimate</h3>

		<p>
		  Front Area:
		  ${kitchenFrontArea} Sq Ft
		</p>

		<p>
		  Structural Area:
		  ${kitchenStructure} Sq Ft
		</p>

		<p>
		  Plywood:
		  ₹${kitchenPlywood.toFixed(2)}
		</p>

		<p>
		  Hardware:
		  ₹${kitchenHardware.toFixed(2)}
		</p>

		<p>
		  Misc:
		  ₹${kitchenMisc.toFixed(2)}
		</p>

		<hr>

		<p>
		  <strong>
		  Kitchen Total:
		  ₹${kitchenCost.toFixed(2)}
		  </strong>
		</p>

	  </div>

	  `;
	}

    const labourCost =
      totalSqft * labourRate;

    const totalCost =
      materialCost + labourCost;

    breakdownHTML += `

      <div class="breakdown-card">

        <h3>Labour Calculation</h3>

        <p>
        ${totalSqft.toFixed(2)}
        × ₹${labourRate}
        = ₹${labourCost.toFixed(2)}
        </p>

      </div>

      <div class="breakdown-card">

        <h2>Final Total</h2>

        <p>
        Material Cost:
        ₹${materialCost.toFixed(2)}
        </p>

        <p>
        Labour Cost:
        ₹${labourCost.toFixed(2)}
        </p>

        <hr>

        <h2>
        Grand Total:
        ₹${totalCost.toFixed(2)}
        </h2>

      </div>

    `;

    document.getElementById("totalSqft").innerText =
      totalSqft.toFixed(2);

    document.getElementById("materialCost").innerText =
      materialCost.toFixed(2);

    document.getElementById("labourCost").innerText =
      labourCost.toFixed(2);

    document.getElementById("totalCost").innerText =
      totalCost.toFixed(2);

    document.getElementById("calculationBreakdown").innerHTML =
      breakdownHTML;

  }
