import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { User_Inventory, DailyScenario} from './types';

const player: User_Inventory = {
    Asset: 2.00,
    Profit: 0.00,
    Income: 0.00,
    Expenses: 0.00,
    Glasses_made: 0.00,
    Glasses_sold: 0.00,
    Price_per_glass: 0.00

};

function purchase_lemon (game_state: User_Inventory, amount: number, price_lemon: number): void{
    const total_cost = amount * price_lemon;
    game_state.Asset = game_state.Asset - total_cost;
};

function lemonade_sale (game_state: User_Inventory, ): void{

}

async function main() {
    const rl = readline.createInterface({ input, output });
    const lemon_price = Math.random() * (0.5 - 0.1) + 0.1;
    const day = 1;
    console.log("On Day " + day + ", the cost of lemonade is " + lemon_price + ".");

    // Ask Player there name
    const amount_of_glass = await rl.question('How many glasses of lemonade do you wish to make? ');
    
    // Ask second question
    const profit = await rl.question('What price (in cents) do you wish to charge for lemonade');

    purchase_lemon(player, amount_of_glass)
    console.log(`User Profile: ${name}, Age: ${age}`);

    showMainPrompt();

    process.stdin.on('keypress', (str, key) => {
        
        // Check if the user pressed Escape, if they do Safely closes the terminal application
        if (key.name === 'escape') {
            console.log('\nExiting program... Goodbye!');
            process.exit(0); 
        }
        
        // Check if the user pressed Enter (return), if they do Reprompt the main menu
        else if (key.name === 'return' || key.name === 'enter') {
            main(); 
        }
    });

    rl.close();
}

main();

function showMainPrompt(): void{
    console.log("Press Space to Continue, ESC to end...");
}
