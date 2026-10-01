import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';


async function main() {
    const rl = readline.createInterface({ input, output });

    console.log("On Day " + day + ", the cost of lemonade is " + cost + ".");

    // Ask Player there name
    const name = await rl.question('How many glasses of lemonade do you wish to make? ');
    
    // Ask second question
    const age = await rl.question('What price (in cents) do you wish to charge for lemonade');

    console.log(`User Profile: ${name}, Age: ${age}`);

    showMainPrompt();
    rl.close();
}

main();

function showMainPrompt(): void{
    console.log("Press Space to Continue, ESC to end...");
}
