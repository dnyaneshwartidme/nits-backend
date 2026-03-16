const parseToMinutes = (timeStr) => {
    const [timePart, modifier] = timeStr.split(' ');
    let [hours, minutes] = timePart.split(':').map(val => parseInt(val, 10));
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
};

const calculateDuration = (inTime, outTime) => {
    const inMins = parseToMinutes(inTime);
    const outMins = parseToMinutes(outTime);
    const diffMins = outMins - inMins;

    if (diffMins > 720 || diffMins < 0) {
        return "N/A (" + (diffMins < 0 ? "Negative" : "Exceeded 12h") + ")";
    } else {
        const hh = Math.floor(diffMins / 60).toString().padStart(2, '0');
        const mm = (diffMins % 60).toString().padStart(2, '0');
        return `${hh}:${mm}`;
    }
};

const testCases = [
    { in: "02:12 PM", out: "05:21 PM", expected: "03:09" },
    { in: "10:00 AM", out: "02:00 PM", expected: "04:00" },
    { in: "09:00 AM", out: "09:00 PM", expected: "12:00" },
    { in: "09:00 AM", out: "09:01 PM", expected: "N/A (Exceeded 12h)" },
    { in: "05:21 PM", out: "02:12 PM", expected: "N/A (Negative)" },
    { in: "12:00 AM", out: "01:00 AM", expected: "01:00" },
    { in: "11:59 PM", out: "12:01 AM", expected: "N/A (Negative)" }, // Same day assumption
];

console.log("Running Time Calculation Verifier...");
testCases.forEach(tc => {
    const result = calculateDuration(tc.in, tc.out);
    const status = result === tc.expected ? "✅ PASS" : "❌ FAIL";
    console.log(`In: ${tc.in.padEnd(10)} | Out: ${tc.out.padEnd(10)} | Expected: ${tc.expected.padEnd(15)} | Result: ${result.padEnd(15)} | ${status}`);
});
