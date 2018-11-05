class LinearAnimation extends Animation 
{
    constructor(time,controlPoints)
    {
        super(time);
        this.controlPoints = controlPoints;
        this.index = 0;

        this.totalDistance = 0.0;
        this.distancePerVec = [];
        this.timeAtControlPoint = [];
        this.speed = 0.0;
        this.rotationAngles = [];
        this.updateVariables();
    };

    getControlPoints()
    {
        return this.controlPoints;
    };

    getCurrentControlPoint()
    {
        return this.controlPoints[this.index];
    };

    updateVariables()
    {
        let i;
        for(i = 0; i < this.controlPoints.length - 1; i++)
        {
            let distance = Math.sqrt(
                Math.pow(this.controlPoints[i+1][0] - this.controlPoints[i][0],2) + 
                Math.pow(this.controlPoints[i+1][1] - this.controlPoints[i][1],2) + 
                Math.pow(this.controlPoints[i+1][2] - this.controlPoints[i][2],2)
            );
            this.rotationAngles[i] = Math.atan((this.controlPoints[i+1][0] - this.controlPoints[i][0])/(this.controlPoints[i+1][2]-this.controlPoints[i][2]));
            this.distancePerVec[i] = distance;
            this.totalDistance += distance;
        }

        this.speed = this.totalDistance / this.time;

        this.timeAtControlPoint[0] = 0;

        for(i = 1; i < this.controlPoints.length; i++)
        {
            this.timeAtControlPoint[i] =  this.timeAtControlPoint[i-1] + (this.distancePerVec[i-1] / this.totalDistance) * this.time;
        }
        
    }

    getCurrentPoint()
    {
        var pos = [];
        for(let i = 0; i < this.timeAtControlPoint.length; i++)
        {
            if(this.timeAtControlPoint[i] > this.timeElapsed)
            {
                let delta = (this.timeElapsed - this.timeAtControlPoint[i-1]) / (this.timeAtControlPoint[i] - this.timeAtControlPoint[i-1]);
                pos[0] = this.controlPoints[i-1][0] + (this.controlPoints[i][0] - this.controlPoints[i-1][0]) * delta;
                pos[1] = this.controlPoints[i-1][1] + (this.controlPoints[i][1] - this.controlPoints[i-1][1]) * delta;
                pos[2] = this.controlPoints[i-1][2] + (this.controlPoints[i][2] - this.controlPoints[i-1][2]) * delta;    
                this.angRotation = this.rotationAngles[i-1];

                break;                
            }
        }

        return pos;
    }

    apply(scene)
    {
        var pos = this.getCurrentPoint();
        
        scene.translate(pos[0],pos[1],pos[2]);
        scene.rotate(this.angRotation,0,1,0);
    };

    applyLast(scene)
    {
        let finalPos = this.controlPoints[this.controlPoints.length-1];
        scene.translate(finalPos[0],finalPos[1],finalPos[2]);
        scene.rotate(this.angRotation,0,1,0);
    }
};