// Indian Mathematical Heritage Calculator - Complete JavaScript Logic

// Global Variables
let currentInput = '';
let currentOperation = '';
let previousInput = '';
let shouldResetDisplay = false;
let angleMode = 'deg'; // deg, rad, grad
let calculationHistory = [];
let sessionStats = {
    totalCalculations: 0,
    functionUsage: {},
    sessionStartTime: Date.now()
};

// DOM Elements
const display = document.getElementById('display-screen');
const historyDisplay = document.getElementById('display-history');
const basicCalculator = document.getElementById('basic-calculator');
const scientificCalculator = document.getElementById('scientific-calculator');
const engineeringCalculator = document.getElementById('engineering-calculator');

// Initialize Calculator
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    loadHistory();
    updateStatistics();
    setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOpenIcon = document.getElementById('menu-open-icon');
    const menuCloseIcon = document.getElementById('menu-close-icon');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const isOpen = mobileMenu.style.display === 'block';
            mobileMenu.style.display = isOpen ? 'none' : 'block';
            menuOpenIcon.style.display = isOpen ? 'block' : 'none';
            menuCloseIcon.style.display = isOpen ? 'none' : 'block';
        });
    }

    // User menu toggle
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userMenuButton) {
        userMenuButton.addEventListener('click', function() {
            const isOpen = userDropdown.style.display === 'block';
            userDropdown.style.display = isOpen ? 'none' : 'block';
        });
    }

    // Calculator mode buttons
    const basicModeBtn = document.getElementById('basic-mode-btn');
    const scientificModeBtn = document.getElementById('scientific-mode-btn');
    const engineeringModeBtn = document.getElementById('engineering-mode-btn');

    if (basicModeBtn) basicModeBtn.addEventListener('click', () => switchCalculatorMode('basic'));
    if (scientificModeBtn) scientificModeBtn.addEventListener('click', () => switchCalculatorMode('scientific'));
    if (engineeringModeBtn) engineeringModeBtn.addEventListener('click', () => switchCalculatorMode('engineering'));

    // Keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
}

// Initialize Calculator
function initializeCalculator() {
    updateDisplay();
    switchCalculatorMode('basic');
}

// Calculator Mode Switching
function switchCalculatorMode(mode) {
    // Hide all calculators
    if (basicCalculator) basicCalculator.style.display = 'none';
    if (scientificCalculator) scientificCalculator.style.display = 'none';
    if (engineeringCalculator) engineeringCalculator.style.display = 'none';

    // Show selected calculator
    switch(mode) {
        case 'basic':
            if (basicCalculator) basicCalculator.style.display = 'block';
            break;
        case 'scientific':
            if (scientificCalculator) scientificCalculator.style.display = 'block';
            break;
        case 'engineering':
            if (engineeringCalculator) engineeringCalculator.style.display = 'block';
            break;
    }

    // Update button states
    document.querySelectorAll('[id$="-mode-btn"]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById(`${mode}-mode-btn`);
    if (activeBtn) activeBtn.classList.add('active');
}

// Display Management
function updateDisplay() {
    if (display) {
        display.textContent = currentInput || '0';
    }
}

function updateHistory(expression, result) {
    if (historyDisplay) {
        historyDisplay.textContent = `${expression} = ${result}`;
    }
}

// Basic Calculator Functions
function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    currentInput = currentInput === '0' ? num : currentInput + num;
    updateDisplay();
}

function appendOperator(op) {
    if (currentInput === '') return;
    
    if (previousInput !== '' && currentOperation !== '') {
        calculate();
    }
    
    previousInput = currentInput;
    currentOperation = op;
    currentInput = '';
    shouldResetDisplay = false;
}

function appendDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
        updateDisplay();
    }
}

function appendFunction(func) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    currentInput += func;
    updateDisplay();
}

function appendConstant(constant) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    let value;
    switch(constant) {
        case 'π':
            value = Math.PI.toString();
            break;
        case 'e':
            value = Math.E.toString();
            break;
        default:
            value = constant;
    }
    
    currentInput = currentInput === '0' ? value : currentInput + value;
    updateDisplay();
}

function clearAll() {
    currentInput = '';
    previousInput = '';
    currentOperation = '';
    shouldResetDisplay = false;
    updateDisplay();
    if (historyDisplay) historyDisplay.textContent = '';
}

function clearEntry() {
    currentInput = '';
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '';
    }
    updateDisplay();
}

function toggleSign() {
    if (currentInput !== '') {
        currentInput = currentInput.startsWith('-') ? 
            currentInput.slice(1) : '-' + currentInput;
        updateDisplay();
    }
}

// Advanced Calculator Functions
function square() {
    if (currentInput !== '') {
        const num = parseFloat(currentInput);
        const result = Math.pow(num, 2);
        addToHistory(`${num}²`, result);
        currentInput = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
    }
}

function factorial() {
    if (currentInput !== '') {
        const num = parseInt(currentInput);
        if (num >= 0 && num <= 170) { // Prevent overflow
            const result = calculateFactorial(num);
            addToHistory(`${num}!`, result);
            currentInput = result.toString();
            shouldResetDisplay = true;
            updateDisplay();
        }
    }
}

function calculateFactorial(n) {
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}

function reciprocal() {
    if (currentInput !== '' && currentInput !== '0') {
        const num = parseFloat(currentInput);
        const result = 1 / num;
        addToHistory(`1/${num}`, result);
        currentInput = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
    }
}

function percentage() {
    if (currentInput !== '') {
        const num = parseFloat(currentInput);
        const result = num / 100;
        addToHistory(`${num}%`, result);
        currentInput = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
    }
}

// Angle Mode Functions
function setAngleMode(mode) {
    angleMode = mode;
    
    // Update button states
    document.querySelectorAll('[id$="-btn"]').forEach(btn => {
        if (btn.id.includes('deg') || btn.id.includes('rad') || btn.id.includes('grad')) {
            btn.classList.remove('active');
        }
    });
    
    const activeBtn = document.getElementById(`${mode}-btn`);
    if (activeBtn) activeBtn.classList.add('active');
}

function convertAngle(angle) {
    switch(angleMode) {
        case 'deg':
            return angle * Math.PI / 180;
        case 'rad':
            return angle;
        case 'grad':
            return angle * Math.PI / 200;
        default:
            return angle;
    }
}

function convertAngleBack(angle) {
    switch(angleMode) {
        case 'deg':
            return angle * 180 / Math.PI;
        case 'rad':
            return angle;
        case 'grad':
            return angle * 200 / Math.PI;
        default:
            return angle;
    }
}

// Main Calculate Function
function calculate() {
    if (currentInput === '' && currentOperation === '') return;
    
    let result;
    let expression;
    
    try {
        if (currentOperation && previousInput !== '') {
            // Basic arithmetic
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            
            expression = `${prev} ${currentOperation} ${current}`;
            
            switch(currentOperation) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        throw new Error('Division by zero');
                    }
                    result = prev / current;
                    break;
                case '^':
                    result = Math.pow(prev, current);
                    break;
                default:
                    return;
            }
        } else {
            // Scientific functions
            expression = currentInput;
            result = evaluateExpression(currentInput);
        }
        
        // Update display and history
        addToHistory(expression, result);
        updateHistory(expression, result);
        
        currentInput = result.toString();
        previousInput = '';
        currentOperation = '';
        shouldResetDisplay = true;
        
        updateDisplay();
        updateStatistics();
        
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(() => {
            clearAll();
        }, 2000);
    }
}

// Expression Evaluation
function evaluateExpression(expr) {
    // Replace mathematical functions and constants
    expr = expr.replace(/π/g, Math.PI);
    expr = expr.replace(/e/g, Math.E);
    
    // Handle trigonometric functions
    expr = expr.replace(/sin\(/g, 'Math.sin(convertAngle(');
    expr = expr.replace(/cos\(/g, 'Math.cos(convertAngle(');
    expr = expr.replace(/tan\(/g, 'Math.tan(convertAngle(');
    expr = expr.replace(/asin\(/g, 'convertAngleBack(Math.asin(');
    expr = expr.replace(/acos\(/g, 'convertAngleBack(Math.acos(');
    expr = expr.replace(/atan\(/g, 'convertAngleBack(Math.atan(');
    
    // Handle other functions
    expr = expr.replace(/log\(/g, 'Math.log10(');
    expr = expr.replace(/ln\(/g, 'Math.log(');
    expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');
    expr = expr.replace(/abs\(/g, 'Math.abs(');
    expr = expr.replace(/exp\(/g, 'Math.exp(');
    expr = expr.replace(/\^/g, '**');
    
    // Add closing parentheses for angle conversions
    let openParens = (expr.match(/convertAngle\(/g) || []).length;
    let closeParens = (expr.match(/\)/g) || []).length;
    
    for (let i = 0; i < openParens - closeParens; i++) {
        expr += ')';
    }
    
    // Evaluate the expression
    return Function('"use strict"; return (' + expr + ')')();
}

// History Management
function addToHistory(expression, result) {
    const historyItem = {
        expression: expression,
        result: result,
        timestamp: new Date().toISOString()
    };
    
    calculationHistory.unshift(historyItem);
    
    // Keep only last 50 calculations
    if (calculationHistory.length > 50) {
        calculationHistory = calculationHistory.slice(0, 50);
    }
    
    saveHistory();
    sessionStats.totalCalculations++;
}

function saveHistory() {
    try {
        // In a real application, you would save to localStorage
        // For Claude artifacts, we'll keep in memory
        updateHistoryDisplay();
    } catch (error) {
        console.log('Could not save history');
    }
}

function loadHistory() {
    try {
        // In a real application, you would load from localStorage
        // For Claude artifacts, we'll start with empty history
        updateHistoryDisplay();
    } catch (error) {
        console.log('Could not load history');
    }
}

function updateHistoryDisplay() {
    const recentCalculations = document.getElementById('recent-calculations');
    if (recentCalculations) {
        recentCalculations.innerHTML = '';
        
        calculationHistory.slice(0, 10).forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">${item.result}</div>
                <div class="history-time">${new Date(item.timestamp).toLocaleString()}</div>
            `;
            recentCalculations.appendChild(historyItem);
        });
    }
}

function clearHistory() {
    calculationHistory = [];
    updateHistoryDisplay();
    sessionStats.totalCalculations = 0;
    updateStatistics();
}

function exportHistory() {
    const data = JSON.stringify(calculationHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calculation_history.json';
    a.click();
    
    URL.revokeObjectURL(url);
}

function importHistory() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedHistory = JSON.parse(e.target.result);
                    calculationHistory = importedHistory;
                    updateHistoryDisplay();
                    updateStatistics();
                } catch (error) {
                    alert('Invalid file format');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// Statistics
function updateStatistics() {
    const totalCalcElement = document.getElementById('total-calculations');
    const mostUsedElement = document.getElementById('most-used-function');
    const avgSessionElement = document.getElementById('avg-session-time');
    
    if (totalCalcElement) {
        totalCalcElement.textContent = sessionStats.totalCalculations;
    }
    
    if (mostUsedElement) {
        const mostUsed = Object.keys(sessionStats.functionUsage).reduce((a, b) => 
            sessionStats.functionUsage[a] > sessionStats.functionUsage[b] ? a : b, 'None');
        mostUsedElement.textContent = mostUsed;
    }
    
    if (avgSessionElement) {
        const sessionTime = Math.floor((Date.now() - sessionStats.sessionStartTime) / 60000);
        avgSessionElement.textContent = `${sessionTime} min`;
    }
}

// Engineering Calculator Functions
function calculateBeamDeflection() {
    const length = parseFloat(document.getElementById('beam-length')?.value || 0);
    const load = parseFloat(document.getElementById('beam-load')?.value || 0);
    const elasticity = parseFloat(document.getElementById('beam-elasticity')?.value || 0);
    
    if (length && load && elasticity) {
        // Simplified beam deflection formula for uniformly distributed load
        const momentOfInertia = Math.pow(length, 4) / 12; // Simplified
        const deflection = (5 * load * Math.pow(length, 4)) / (384 * elasticity * 1e9 * momentOfInertia);
        
        const resultElement = document.getElementById('beam-result');
        if (resultElement) {
            resultElement.innerHTML = `
                <h5>Beam Deflection Results:</h5>
                <p>Maximum Deflection: ${deflection.toFixed(6)} m</p>
                <p>Deflection in mm: ${(deflection * 1000).toFixed(3)} mm</p>
            `;
        }
    }
}

function calculateOhmsLaw() {
    const voltage = parseFloat(document.getElementById('voltage')?.value || 0);
    const current = parseFloat(document.getElementById('current')?.value || 0);
    const resistance = parseFloat(document.getElementById('resistance')?.value || 0);
    
    let results = [];
    
    if (voltage && current && !resistance) {
        const r = voltage / current;
        results.push(`Resistance: ${r.toFixed(3)} Ω`);
    }
    
    if (voltage && resistance && !current) {
        const i = voltage / resistance;
        results.push(`Current: ${i.toFixed(3)} A`);
    }
    
    if (current && resistance && !voltage) {
        const v = current * resistance;
        results.push(`Voltage: ${v.toFixed(3)} V`);
    }
    
    if (voltage && current) {
        const power = voltage * current;
        results.push(`Power: ${power.toFixed(3)} W`);
    }
    
    const resultElement = document.getElementById('ohm-result');
    if (resultElement) {
        resultElement.innerHTML = `
            <h5>Ohm's Law Results:</h5>
            ${results.map(r => `<p>${r}</p>`).join('')}
        `;
    }
}

function calculateConcreteMix() {
    const volume = parseFloat(document.getElementById('concrete-volume')?.value || 0);
    const grade = document.getElementById('concrete-grade')?.value || 'M20';
    
    if (volume) {
        let ratios;
        switch(grade) {
            case 'M20':
                ratios = { cement: 1, sand: 1.5, aggregate: 3 };
                break;
            case 'M25':
                ratios = { cement: 1, sand: 1, aggregate: 2 };
                break;
            case 'M30':
                ratios = { cement: 1, sand: 1, aggregate: 1.5 };
                break;
            default:
                ratios = { cement: 1, sand: 1.5, aggregate: 3 };
        }
        
        const total = ratios.cement + ratios.sand + ratios.aggregate;
        const cement = (volume * ratios.cement / total * 1440).toFixed(0); // kg
        const sand = (volume * ratios.sand / total).toFixed(2); // m³
        const aggregate = (volume * ratios.aggregate / total).toFixed(2); // m³
        
        const resultElement = document.getElementById('concrete-result');
        if (resultElement) {
            resultElement.innerHTML = `
                <h5>Concrete Mix (${grade}) for ${volume} m³:</h5>
                <p>Cement: ${cement} kg</p>
                <p>Sand: ${sand} m³</p>
                <p>Aggregate: ${aggregate} m³</p>
                <p>Water: ${(volume * 0.5).toFixed(0)} liters (approx.)</p>
            `;
        }
    }
}

function calculateHeatTransfer() {
    const area = parseFloat(document.getElementById('heat-area')?.value || 0);
    const coefficient = parseFloat(document.getElementById('heat-coefficient')?.value || 0);
    const tempDiff = parseFloat(document.getElementById('temp-diff')?.value || 0);
    
    if (area && coefficient && tempDiff) {
        const heatTransfer = area * coefficient * tempDiff;
        
        const resultElement = document.getElementById('heat-result');
        if (resultElement) {
            resultElement.innerHTML = `
                <h5>Heat Transfer Results:</h5>
                <p>Heat Transfer Rate: ${heatTransfer.toFixed(2)} W</p>
                <p>Heat Transfer Rate: ${(heatTransfer / 1000).toFixed(3)} kW</p>
                <p>BTU/hr: ${(heatTransfer * 3.412).toFixed(2)} BTU/hr</p>
            `;
        }
    }
}

// Unit Conversion Functions
function convertLength() {
    const input = prompt('Enter value to convert (format: "value unit_from unit_to")\nSupported units: m, cm, mm, km, in, ft, yd');
    if (input) {
        const parts = input.split(' ');
        if (parts.length === 3) {
            const value = parseFloat(parts[0]);
            const fromUnit = parts[1].toLowerCase();
            const toUnit = parts[2].toLowerCase();
            
            const result = convertLengthValue(value, fromUnit, toUnit);
            alert(`${value} ${fromUnit} = ${result} ${toUnit}`);
        }
    }
}

function convertLengthValue(value, from, to) {
    const meters = {
        'm': 1,
        'cm': 0.01,
        'mm': 0.001,
        'km': 1000,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144
    };
    
    const valueInMeters = value * meters[from];
    return (valueInMeters / meters[to]).toFixed(6);
}

// Advanced Mathematical Functions
function solveQuadratic() {
    const a = parseFloat(prompt('Enter coefficient a:') || 0);
    const b = parseFloat(prompt('Enter coefficient b:') || 0);
    const c = parseFloat(prompt('Enter coefficient c:') || 0);
    
    if (a === 0) {
        alert('Not a quadratic equation (a cannot be 0)');
        return;
    }
    
    const discriminant = b * b - 4 * a * c;
    
    if (discriminant < 0) {
        alert('No real solutions (discriminant < 0)');
    } else if (discriminant === 0) {
        const x = -b / (2 * a);
        alert(`One solution: x = ${x}`);
    } else {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        alert(`Two solutions: x₁ = ${x1.toFixed(6)}, x₂ = ${x2.toFixed(6)}`);
    }
}

function matrixOperations() {
    alert('Matrix operations feature - Enter matrices in format: [[1,2],[3,4]]');
    // This would be expanded with a proper matrix input interface
}

function complexNumbers() {
    alert('Complex number operations - Enter in format: a+bi');
    // This would be expanded with complex number input interface
}

function statisticalAnalysis() {
    const data = prompt('Enter numbers separated by commas:');
    if (data) {
        const numbers = data.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
        
        if (numbers.length > 0) {
            const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
            const variance = numbers.reduce((a, b) => a + (b - mean) ** 2, 0) / numbers.length;
            const stdDev = Math.sqrt(variance);
            const min = Math.min(...numbers);
            const max = Math.max(...numbers);
            
            alert(`Statistics:\nMean: ${mean.toFixed(4)}\nStd Dev: ${stdDev.toFixed(4)}\nMin: ${min}\nMax: ${max}`);
        }
    }
}

function numericIntegration() {
    alert('Numeric integration feature - This would integrate functions using trapezoidal rule');
    // This would be expanded with function input and integration limits
}

function numericDifferentiation() {
    alert('Numeric differentiation feature - This would differentiate functions numerically');
    // This would be expanded with function input and differentiation point
}

// Keyboard Input Handler
function handleKeyboardInput(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Backspace') {
        deleteLast();
    }
}

// Placeholder functions for engineering tools
function convertArea() { alert('Area conversion tool - Coming soon!'); }
function convertVolume() { alert('Volume conversion tool - Coming soon!'); }
function convertMass() { alert('Mass conversion tool - Coming soon!'); }
function convertTemperature() { alert('Temperature conversion tool - Coming soon!'); }
function convertPressure() { alert('Pressure conversion tool - Coming soon!'); }

function beamDeflection() { alert('Advanced beam deflection calculator - Coming soon!'); }
function pipeFlow() { alert('Pipe flow calculator - Coming soon!'); }
function heatTransfer() { alert('Heat transfer calculator - Coming soon!'); }
function electricalPower() { alert('Electrical power calculator - Coming soon!'); }
function structuralLoad() { alert('Structural load calculator - Coming soon!'); }
function fluidMechanics() { alert('Fluid mechanics calculator - Coming soon!'); }

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCalculator);
} else {
    initializeCalculator();
}