class Animation 
{

    constructor(time)
    {
        this.time = time;
        this.timeElapsed = 0.0;
    };

    getTime() // miliseconds
    {
        return this.timeElapsed;
    };

    setTime(newTime) // miliseconds
    {
        this.time = newTime;
    };

    decreaseTime(delta) // miliseconds
    {
        this.timeElapsed += delta;
    }

    isAnimationOver()
    {
        return this.timeElapsed > this.time;
    }

};