
function checkPalindrom(arr){
    var arrResult = [];
    
    for(var i=0; i<arr.length; i++){
        var temp = 0;
        if(typeof(arr[i]) === 'number'){
            arr[i] = arr[i].toString();
            temp = i;
        }
        var counterLeft = 0;
        var counterRight = arr[i].length - 1;
        var counter = 0;    
        var wordhalfLength = Math.round(arr[i].length / 2);

        while(counterLeft < wordhalfLength){
            if(arr[i].toLowerCase().charAt(counterLeft) == arr[i].toLowerCase().charAt(counterRight))
            {
                counter++;
            }
            counterLeft++;
            counterRight--;
            if(counterLeft == wordhalfLength)
            {
                if(temp > 0){
                    arr[temp] = Number(arr[temp]);
                }
               if(counter >= wordhalfLength)
                {
                    arrResult.push({
                        word: arr[i],
                        identification: "is a palindrome"
                    });
                }
                else{
                    arrResult.push({
                        word: arr[i],
                        identification: "is not a palindrome"
                    });               
                }
            }
        }
    }
    return arrResult;
}

var sample = ["deified","algorithm",100010001,"rotator","javascript","words"];
console.log(checkPalindrom(sample));