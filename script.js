const texts = {
    en: {
        title: "Barrel Topping Calculator",
        gallonsLabel: "Gallons used:",
        barrelsLabel: "Barrel batches (comma-separated):",
        calculateBtn: "Calculate",
        totalBarrelsText: "Total barrels:",
        perBarrelText: "Gallons per barrel (unrounded):",
        distributionTitle: "Distribution per batch:",
        subtractionTitle: "Subtraction Steps:",
        toggleLanguage: "Español",
        remaining: "remaining",
        initialTotal: "Initial total:",
        so2Title: "SO₂ Calculator"
    },
    es: {
        title: "Calculadora de Topping para Barriles",
        gallonsLabel: "Galones usados:",
        barrelsLabel: "Lotes de barriles (separados por comas):",
        calculateBtn: "Calcular",
        totalBarrelsText: "Total de barriles:",
        perBarrelText: "Galones por barril (sin redondear):",
        distributionTitle: "Distribución por lote:",
        subtractionTitle: "Pasos de resta:",
        toggleLanguage: "English",
        remaining: "restantes",
        initialTotal: "Total inicial:",
        so2Title: "Calculadora de SO₂"
    }
};

let currentLanguage = 'en';

document.getElementById('languageToggle').addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
    updateLanguage();
});

function updateLanguage() {
    const t = texts[currentLanguage];
    document.getElementById('appTitle').textContent = t.title;
    document.getElementById('gallonsLabel').textContent = t.gallonsLabel;
    document.getElementById('barrelsLabel').textContent = t.barrelsLabel;
    document.getElementById('calculateBtn').textContent = t.calculateBtn;
    document.getElementById('languageText').textContent = t.toggleLanguage;
    document.getElementById('totalBarrelsText').textContent = t.totalBarrelsText;
    document.getElementById('perBarrelText').textContent = t.perBarrelText;
    document.getElementById('distributionTitle').textContent = t.distributionTitle;
    document.getElementById('subtractionTitle').textContent = t.subtractionTitle;
    document.getElementById('so2Title').textContent = t.so2Title;
}

function calculate() {
    const gallons = parseFloat(document.getElementById("gallons").value);
    const barrelBatches = document.getElementById("barrelBatches").value.split(",").map(Number);
    const totalBarrels = barrelBatches.reduce((a, b) => a + b, 0);

    if (!gallons || totalBarrels === 0 || isNaN(gallons)) {
        alert(currentLanguage === 'en' ? "Please enter valid data!" : "¡Ingrese datos válidos!");
        return;
    }

    const gallonsPerBarrel = gallons / totalBarrels;
    document.getElementById("totalBarrels").textContent = totalBarrels;
    document.getElementById("perBarrel").textContent = gallonsPerBarrel.toFixed(4);

    let batchResultsHTML = '';
    let subtractionStepsHTML = '';
    let remainingGallons = gallons;
    let roundedGallons = [];
    let totalRounded = 0;

    barrelBatches.forEach((batch, index) => {
        const batchGallons = batch * gallonsPerBarrel;
        const rounded = Math.round(batchGallons * 4) / 4;
        roundedGallons.push(rounded);
        totalRounded += rounded;
    });

    const difference = gallons - totalRounded;
    if (difference !== 0) {
        roundedGallons[roundedGallons.length - 1] += difference;
    }

    subtractionStepsHTML += `<p>${texts[currentLanguage].initialTotal} ${remainingGallons.toFixed(2)}G</p>`;

    barrelBatches.forEach((batch, index) => {
        const rounded = roundedGallons[index];
        batchResultsHTML += `
            <div class="result-item">
                <strong>${currentLanguage === 'en' ? 'Batch' : 'Lote'} ${index + 1} (${batch} ${currentLanguage === 'en' ? 'barrels' : 'barriles'}):</strong> 
                ${rounded.toFixed(2)}G
            </div>
        `;
        subtractionStepsHTML += `
            <p>${remainingGallons.toFixed(2)}G - ${rounded.toFixed(2)}G (${currentLanguage === 'en' ? 'Batch' : 'Lote'} ${index + 1}) = ${(remainingGallons - rounded).toFixed(2)}G ${texts[currentLanguage].remaining}</p>
        `;
        remainingGallons -= rounded;
    });

    document.getElementById("batchResults").innerHTML = batchResultsHTML;
    document.getElementById("subtractionSteps").innerHTML = subtractionStepsHTML;
    document.getElementById("result").style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();

    document.getElementById('calculateBtn').addEventListener('click', () => {
        const barrelType = parseFloat(document.getElementById('barrelType').value);
        const ppm = parseFloat(document.getElementById('ppm').value);
        const so2Percent = parseFloat(document.getElementById('so2Percent').value);

        if (isNaN(barrelType) || isNaN(ppm) || isNaN(so2Percent) || so2Percent === 0) {
            return;
        }

        const mgPerL = ppm;
        const totalMg = barrelType * mgPerL;
        const mlToAdd = totalMg / (so2Percent * 10);

        document.getElementById('so2Amount').textContent = mlToAdd.toFixed(2) + " ml";
        document.getElementById('calculationDetails').innerHTML = `
            <p>${barrelType} L × ${ppm} ppm = ${totalMg.toFixed(2)} mg SO₂</p>
            <p>SO₂ %: ${so2Percent}% → ${mlToAdd.toFixed(2)} ml to add</p>
        `;
    });
});
