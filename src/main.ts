import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { User_Inventory, DailyScenario} from './types';

let day = 1;

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
    game_state.Expenses = total_cost;
    game_state.Glasses_made = amount;
};

function lemonade_sale (game_state: User_Inventory, amount: number, price_lemonade: number, ): void{
    const sale = Math.random() * (amount - 0) + 0;
    game_state.Glasses_sold = sale;
    game_state.Income += sale;

}

process.stdin.on('keypress', (str, key) => {
        
        // Check if the user pressed Escape, if they do Safely closes the terminal application
        if (key.name === 'escape') {
            console.log('\nExiting program... Goodbye!');
            process.exit(0); 
        }
        
        // Check if the user pressed Enter (return), if they do Reprompt the main menu
        else if (key.name === 'return' || key.name === 'enter') {
            day += 1;
            main(); 
        }
    });

async function main() {
    const rl = readline.createInterface({ input, output });
    const lemon_price = Math.random() * (0.5 - 0.1) + 0.1;
    console.log("On Day " + day + ", the cost of lemonade is " + lemon_price + ".");

    // Ask Player there name
    const amount_of_glass = await rl.question('How many glasses of lemonade do you wish to make? ');
    
    // Ask second question
    const profit = await rl.question('What price (in cents) do you wish to charge for lemonade');

    const amount_of_glass_as_number = parseInt(amount_of_glass, 10);
    const price_of_lemonade = parseInt(profit, 10);
    purchase_lemon(player, amount_of_glass_as_number, lemon_price);

    lemonade_sale(player, amount_of_glass_as_number, price_of_lemonade);

    player.Price_per_glass = price_of_lemonade;
    player.Profit = player.Income - player.Expenses;
    player.Asset += player.Income;





    showMainPrompt();

    

    rl.close();
}

main();

function showMainPrompt(): void{
    console.log("Press Space to Continue, ESC to end...");
}
