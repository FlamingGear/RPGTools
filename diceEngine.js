var testPerDice = false;
var testMinimum = true;

var _ = require("lodash");

function parseRoll(diceRoll)
{
	//Regex Explained:
	// ([0-9]*)d([0-9]+)	-Optional number before d, capture it, non-optional number AFTER d, capture it
	//  *([+-])? *			-Capture a following + / -, ignoring whitespace
	//	*([0-9]+)* *		-Capture the following number (if it exists)
	// (?:\[([0-9+-]+)\])?	-Capture a following number and brackets 
	//						-(signifies a test: [4+] for a per-dice test (4+) for a test on the sum of the dice)

	var regex = /([0-9]*)d([0-9]+) *([+-])? *([0-9]+)* *([\(\[\]\)0-9+-]+)/ig
    var regexResults = regex.exec(diceRoll);

	var testRegex = /([0-9]+)/g;
    var testNumber = testRegex.exec(regexResults[5]);

    var rollInfo = 
    {
        count		: parseInt(regexResults[1]),    //start of string until d, numeric only
        dice		: parseInt(regexResults[2]),    //d until non-alphanumeric, non-whitespace char.
        negative	: (regexResults[3] == "-") ? true : false,
        adjustment	: parseInt(regexResults[4]),    //Adjustment Number
        test        : {}
    }
    
    //Handle Test Sub-Object
    if (regexResults[5])
    {
        rollInfo.test = { 
            testValue: parseInt(testNumber[1]),		    //The min / max number to pass the test
            testPerDice: (regexResults[5].indexOf("[") != -1),   //Test method to use (per-dice / summation)
            testMinimum: (regexResults[5].indexOf("-") == -1)    //Whether the test value is a minimum or maximum
        }
    }
    
    //Handle Negative Adjustments
    if (rollInfo.negative)
	{ rollInfo.adjustment *= -1; }
        
    //console.dir(rollInfo);
        
    return rollInfo;
}

function roll(diceRoll)
{
    var rollInfo = parseRoll(diceRoll);
    var possibilities = xdy(rollInfo.count, rollInfo.dice, rollInfo.adjustment); 
	var selectedNo = Math.floor(Math.random() * possibilities.length);
	var result = possibilities[selectedNo];
    console.log(result);
	
	if (rollInfo.test == {})
	{
		return result;
	}
	else
	{
		var passes = 0;

		if (rollInfo.test.testPerDice)
		{
			for (var die of result.dice)
			{
				if (testMinimum)
				{
					if (die >= rollInfo.test.testValue)
					{ passes += 1; }
				}
				else
				{
					if (die <= rollInfo.test.testValue)
					{ passes += 1; }
				}
			}
		}
		else
		{
			if (testMinimum)
			{
				if (result.sum >= rollInfo.test.testValue)
				{ passes = 1; }
			}
			else
			{
				if (result.sum <= rollInfo.test.testValue)
				{ passes = 1; }
			}
		}		

		return passes;
	}
}

function xdy(count, dice, adjustment)
{
    if (isNaN(adjustment))
    {
        adjustment = 0;
    }
    
	var resultsBuffer = [];
	var results = [];
    results.push({ 
            dice: [],
            adjustment: 0,
            multiples: [],
            sum: 0
        });
        
    dice = parseInt(dice) + 1;
	count = parseInt(count);
    //console.log(count + "d" + dice);

	//Loop for each dice
	for (var x = 0; x < count; x++)
	{
		//Copy the results to resultsBuffer
		resultsBuffer = results;
        
        // console.log(x + " stage of first loop");
        // console.dir(results);
        // console.dir(resultsBuffer);
		
		//Clear results
		results = [];
        var i = 0;

		//For each member of resultsBuffer
		for (var result of resultsBuffer)
		{
            // console.log(i++ + " stage of second loop");
            // console.dir(result);
            
			//Loop for each possible result of THIS dice
			for (var y = 1; y < dice; y++)
			{               
                var newResult = _.cloneDeep(result);
                
				//Push a new object to results for the that result with this additional dice.
				if (newResult.dice[x])
                { newResult.dice[x] = _.clone(y); }
                else
                { newResult.dice.push(_.clone(y)); }
				newResult.adjustment = adjustment;
				newResult.multiples = findMultiples(newResult.dice);
				newResult.sum = newResult.dice.reduce( (prev, curr) => prev + curr ) + adjustment;

                // console.log(y + " stage of third loop");
                // console.dir(newResult);

				results.push(newResult);
                // console.dir(results);
			}
            
            // console.log("End of third Loop");
            // console.dir(results);
		}
	}

	return results;
};

function findMultiples(array)
{
	var multiples = [];
    //console.log("Finding matches in " + array);

	//i = count of matches (doubles, triples, quads, etc.)
	for (var i = 1; i < array.length; i++)
	{
		//j = first number to match
		for (var j = 0; j < (array.length-1); j++)
		{
			var matches = 0;
			
			//k = second number to match
			for (var k = (j+1); k < array.length; k++)
			{
				if (array[j] == array[k])
				{
					matches += 1;
				}

				if (matches >= i)
				{
					multiples[i] = true;
                    break;
                }
			}
            
            if (multiples[i])
            { break; }
		}
	}
    
    //console.log("Found matches: " + multiples);
	return multiples;
}

var finalResult = roll("3D6 +4 (14+)");
console.dir(finalResult);
