/* Calculator Modal Logic */

function openCalculatorModal() {
    document.getElementById('calculatorModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCalculatorModal() {
    document.getElementById('calculatorModal').classList.remove('active');
    document.body.style.overflow = '';
}

function switchCalculatorTab(tabName) {
    const tabs = document.querySelectorAll('.calculator-tab');
    const panels = document.querySelectorAll('.calculator-panel');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    panels.forEach(panel => panel.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.getElementById(tabName + 'Panel').classList.add('active');
}

function formatCurrency(amount) {
    return amount.toLocaleString('en-BD', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }) + ' BDT';
}

/* SIP Calculator */
function calculateSIP() {
    const monthlyInvestment = parseFloat(document.getElementById('sipInvestment').value);
    const timePeriod = parseFloat(document.getElementById('sipYears').value);
    const expectedReturn = parseFloat(document.getElementById('sipReturn').value);
    
    if (!monthlyInvestment || !timePeriod || !expectedReturn) {
        alert('Please fill in all fields');
        return;
    }
    
    const r = expectedReturn / 12 / 100;
    const n = timePeriod * 12;
    
    const futureValue = monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    
    const totalInvestment = monthlyInvestment * n;
    const returns = futureValue - totalInvestment;
    
    document.getElementById('sipResult').classList.add('active');
    document.getElementById('sipResultValue').textContent = formatCurrency(Math.round(futureValue));
    document.getElementById('sipBreakdown').innerHTML = `
        <p>Total Investment: ${formatCurrency(Math.round(totalInvestment))}</p>
        <p>Expected Returns: ${formatCurrency(Math.round(returns))}</p>
        <p>Time Period: ${timePeriod} Years (${n} Months)</p>
        <p>Expected Annual Return: ${expectedReturn}%</p>
    `;
}

/* Lump Sum Calculator */
function calculateLumpSum() {
    const investment = parseFloat(document.getElementById('lumpSumInvestment').value);
    const timePeriod = parseFloat(document.getElementById('lumpSumYears').value);
    const expectedReturn = parseFloat(document.getElementById('lumpSumReturn').value);
    
    if (!investment || !timePeriod || !expectedReturn) {
        alert('Please fill in all fields');
        return;
    }
    
    const r = expectedReturn / 100;
    const n = timePeriod;
    
    const futureValue = investment * Math.pow(1 + r, n);
    const returns = futureValue - investment;
    
    document.getElementById('lumpSumResult').classList.add('active');
    document.getElementById('lumpSumResultValue').textContent = formatCurrency(Math.round(futureValue));
    document.getElementById('lumpSumBreakdown').innerHTML = `
        <p>Initial Investment: ${formatCurrency(Math.round(investment))}</p>
        <p>Expected Returns: ${formatCurrency(Math.round(returns))}</p>
        <p>Time Period: ${timePeriod} Years</p>
        <p>Expected Annual Return: ${expectedReturn}%</p>
    `;
}

/* Tax Calculator */
function calculateTax() {
    const gender = document.querySelector('input[name="gender"]:checked');
    const yearlyIncome = parseFloat(document.getElementById('taxYearlyIncome').value);
    const alreadyInvested = parseFloat(document.getElementById('taxInvested').value) || 0;
    
    if (!gender || !yearlyIncome) {
        alert('Please fill in all required fields');
        return;
    }
    
    const isMale = gender.value === 'male';
    const taxFreeThreshold = isMale ? 300000 : 350000;
    const maxCeiling = 140000;
    
    if (yearlyIncome <= taxFreeThreshold) {
        document.getElementById('taxResult').classList.add('active');
        document.getElementById('taxResultInfo').innerHTML = `
            <p><strong>No tax to pay!</strong></p>
            <p>Your income is below the tax-free threshold of ${formatCurrency(taxFreeThreshold)}</p>
        `;
        return;
    }
    
    const taxableIncome = yearlyIncome - taxFreeThreshold;
    const maxQualifyingInvestment = Math.min(taxableIncome / 3, maxCeiling);
    let additionalInvestment = Math.ceil(maxQualifyingInvestment - alreadyInvested);
    
    if (additionalInvestment < 0) {
        additionalInvestment = 0;
    }
    
    const taxRebate = additionalInvestment * 0.15;
    
    document.getElementById('taxResult').classList.add('active');
    document.getElementById('taxResultInfo').innerHTML = `
        <p><strong>Your Tax Information:</strong></p>
        <p>Yearly Income: ${formatCurrency(yearlyIncome)}</p>
        <p>Tax-Free Threshold (${isMale ? 'Male' : 'Female'}): ${formatCurrency(taxFreeThreshold)}</p>
        <p>Taxable Income: ${formatCurrency(taxableIncome)}</p>
        <p>Already Invested: ${formatCurrency(alreadyInvested)}</p>
        <p style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(212, 227, 138, 0.3); color: var(--color-b);">
            <strong>To get maximum tax rebate benefit, you must additionally invest:</strong><br>
            <span style="font-size: 1.5rem; font-weight: 700;">${formatCurrency(additionalInvestment)}</span>
        </p>
        <p style="color: rgba(255, 255, 255, 0.6);">
            Otherwise, you have to pay extra tax of: <strong>${formatCurrency(Math.round(taxRebate))}</strong>
        </p>
    `;
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('calculatorModal');
    if (e.target === modal) {
        closeCalculatorModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCalculatorModal();
    }
});
