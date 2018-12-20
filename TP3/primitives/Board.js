class Board extends CGFobject 
{
    constructor(scene, npartsX, npartsY, textureP1, textureP2, textureSelected, texturePiece1, texturePiece2)
    {
        super(scene);

        this.npartsX = npartsX;
        this.npartsY = npartsY;
        this.textureP1 = textureP1;
        this.textureP2 = textureP2;
        this.texturePiece1 = texturePiece1;
        this.texturePiece2 = texturePiece2;
        this.textureSelected = textureSelected;

        this.spaces = [];
        this.pieces = [];
        this.piecePicked = null;

        this.squareSize = (1.0/this.npartsX);
        this.pieceSize = (1.0/this.npartsX) * 0.8;

        this.def = new CGFappearance(this.scene);
        this.def.setAmbient(1,1,1,1);
        this.def.setSpecular(0.7,0.7,0.7,1);
        this.def.setTexture(this.textureP1);
                
        this.createSpaces();
        this.createPieces(scene);
    };

    createSpaces()
    {
        var tmhX = 1.0/this.npartsX;
        var tmhY = 1.0/this.npartsY;

        for(let i = -0.5; i < 0.5 - 0.0005; i += tmhY)
        {
            let line = [];
            for(let j = -0.5; j < 0.5 - 0.0005; j += tmhX)
            {                
                line.push(new PickableObject(this.scene,j,i,j+tmhX,i+tmhY,this.textureSelected));
            }
            this.spaces.push(line);
        }
    };

    createPieces(scene)
    {
        for(let i = 0; i < this.npartsX * 2; i++)
        {
            if(i < this.npartsX)
                this.pieces.push(new Piece(scene, "p" + (i+1), this.pieceSize, this.texturePiece1, this.textureP1, this.textureP2, 1, i+1));
            else
                this.pieces.push(new Piece(scene, "p" + String.fromCharCode(65 - this.npartsX + i), this.pieceSize, this.texturePiece2, this.textureP1, this.textureP2, this.npartsY, i+1-this.npartsX));
        }
    }

    display()
    {  
        this.displayPieces();
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2.0, 0, 0, 1);
            this.displayBoard();
        this.scene.popMatrix();
    };

    displayBoard()
    {
        this.def.apply();
        for(let i = 0; i < this.spaces.length; i++)
        {                     
            for(let j = 0; j < this.spaces[i].length; j++)
            {   
                if((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0))
                    this.def.setTexture(this.textureP1);
                else                
                    this.def.setTexture(this.textureP2);
                this.def.apply();
                this.scene.registerForPick(i*this.spaces.length + j + 1, this.spaces[i][j]);
                
                this.spaces[i][j].applyTexture();
                this.spaces[i][j].display();
            }            
        }
    };

    displayPieces()
    {
        for(let i = 0; i < this.pieces.length; i++)
        {                     
            this.scene.pushMatrix();
                    this.scene.translate(0.5 + (this.squareSize - this.pieceSize) / 2.0 - this.pieces[i].X * this.squareSize, -0.5 - this.squareSize - (this.squareSize - this.pieceSize) / 2.0 + (this.pieces[i].Y + 1) * this.squareSize, 0);
                    this.scene.rotate(-Math.PI / 2.0, 0, 0, 1);
                this.pieces[i].display();
            this.scene.popMatrix(); 
        }
    };

    getBoard()
    {
        var board = new Array(this.npartsY);
        
        for(var i = 0; i < this.npartsY; i++)
        {
            board[i] = new Array(this.npartsX).fill("e");
        }

        for(var i = 0; i < this.pieces.length; i++)
        {
            board[this.pieces[i].X - 1][this.pieces[i].Y - 1] = this.pieces[i].name;
        }

        return JSON.stringify(board).replace(/"/g, '');
    }

    setBoard(board)
    {
        var board_str = "<" + board.replace(/\[/g, '').replace(/\]/g, '') + ">";
        board_str = board_str.replace(/,/g, "><");
        board_str = (board_str.match(/<(.*?)>/g).map(function(val){ return val.replace(/>/g, '');})).map(function(val){ return val.replace(/</g, '');});;
        
        for(var i = 0; i < board_str.length; i++)
        {
            if(board_str[i] != "e")
            {
                for(var j = 0; j < this.pieces.length; j++)
                {
                    if(this.pieces[j].name == board_str[i])
                    {
                        this.pieces[j].X = Math.floor(i / this.npartsY) + 1;
                        this.pieces[j].Y = (i % this.npartsY) + 1;
                        break; 
                    }
                }
            }
        }
    }

    getValidMoves(validCoords)
    {
        validCoords = validCoords.substring(1,validCoords.length - 1);        
        let points = (validCoords.match(/\[(.*?)\]/g).map(function(val){ return val.replace(/\[/g, '');})).map(function(val){ return val.replace(/\]/g, '');});

        let validMoves = new Array(this.npartsY);        
        for(var i = 0; i < this.npartsY; i++) validMoves[i] = new Array(this.npartsX).fill(false);
        
        points.forEach(element => {
            let coords = element.split(',').map(function(item) { return parseInt(item, 10); });
            validMoves[coords[0] - 1][coords[1] - 1] = true;
        });

        console.log(validMoves);
    }
};