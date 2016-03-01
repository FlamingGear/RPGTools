Rolling Dice:

In order to roll dice, the roll() method is called with a string representation of the roll you wish to make.
This string must be constructed thusly:

    <x>d<y> <+>/<-> <z> <[t]>/<(t)>
    
x is the number of dice to be rolled

y is the maximum number that can be rolled on that dice (so for a six-sided dice, 6)

z is the adjustment to be made to the total of the dice (signed by the preceding +/-

t is the test to be made against the randomly selected result. If surrounded by [square brackets] the test will be performed upon the result of each dice. If surrounded by (round brackets) the test will be performed upon the final sum of the roll, after applying the adjustment.

X, Z, and T are optional.
    without an X, one dice of that type will be rolled.
    without a Y, the sum will be simply the sum of the dice.
    without a T, an object will be returned representing the result of the dice.
    
The untested result object will be of this format:
{
    dice[]      : the array of results of EACH dice.
    sum         : the integer sum of the results (after applying adjustment)
    adjustment  : the adjustment made to the sum
    multiples[] : an array of booleans representing if there are matching sets.
}
    
For example, the result [,true,true] means that there were both doubles and triples rolled amongst the results.
Whereas the result [,true] means that doubles were rolled, but triples were not
This will always expand out to the number of dice rolled.
Obviously, if you find the highest matching set, there will be instances of every matching set beneath it (in order to have four twos, you must also have three twos, and a pair of twos) so this may later change to an integer representing the highest matching count.
(the first result will always be null, as you cannot match 1 different dice)
