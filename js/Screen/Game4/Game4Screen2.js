function Game4Screen2 () {

    var _inputLength = 7;
    var _selectTextLength = 81;
    var _selectText = []
    var _iScore = 0;
    var _iTimeElapsed;

    var posStartX = 0;
    var posStartY = 0;
    var posStopX = 0;
    var posStopY = 0;

    var _notifiText;

    var _textSelectStart = null;
    var _textSelectEnd = null;
    var _textSelect = '';
    var mouseDown = false;

    var _gameContainer

    var s_TextSelect;
    var s_TextHide = [];

    var gamePart = 1;

    var textInput = [
        {
            text: 'mirror',
            texthide: '',
            status: false,
        },
        {
            text: 'parrot',
            texthide: '',
            status: false,
        },
        {
            text: 'pond',
            texthide: '',
            status: false,
        },
        {
            text: 'finally',
            texthide: '',
            status: false,
        },
        {
            text: 'climb',
            texthide: '',
            status: false,
        },
    ]

    var _FailedPartPanel;
    var _PassPartPanel;

    var questionFind = 0;

    this.init = function() {

        _iTimeElapsed = 60000;
        gamePart = 0;
        _bUpdate = true;
        _iScore = 0;


        _gameContainer = new createjs.Container();

        var oModePos = {x: CANVAS_WIDTH/2, y: 875};
        // Add background
        _Bg = createBitmap(s_oSpriteLibrary.getSprite('ldp_background'));
        s_oStage.addChild(_Bg);

        // Overlay Layout
        _Fade = new createjs.Shape()
        _Fade.graphics.beginFill('black').drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        _Fade.alpha = 0.6
        s_oStage.addChild(_Fade);
        _Listener = _Fade.on("click", function () {});

        // Add Audio Button
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2) - 30, y: (oSprite.height/2) + 30};
            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);    
        }

        // Add Cart Button
        var oSprite = s_oSpriteLibrary.getSprite('cart_icon');
        _pCartPos = {x: CANVAS_WIDTH - (oSprite.height/2) - 30, y: (oSprite.height/2) + 30};
        _ButtonCart = new CGfxButton(_pCartPos.x, _pCartPos.y, oSprite, s_oStage);
        _ButtonCart.addEventListener(ON_MOUSE_UP, ()=>{} , this);

        var oSprite = s_oSpriteLibrary.getSprite('game_pause');
        _pPausePos = {x: CANVAS_WIDTH - (oSprite.height/2) - 30, y: (oSprite.height/2) + 30};
        _ButtonPause = new CGfxButton(_pPausePos.x, _pPausePos.y, oSprite, s_oStage);

        _Scores = new GameInfo(_pCartPos.x, _pCartPos.y - 50, s_oSpriteLibrary.getSprite('start'), s_oSpriteLibrary.getSprite('game_info_bg_2'), '0', '#fce48a', s_oStage)

        _Time = new TimeProcess(_pCartPos.x, _pCartPos.y - 50, '00:00', 70, s_oStage)

        s_TextSelect = new CText(oModePos.x + 500, oModePos.y - 180, null, ' ', "MontserratBlack", "#fce48a", 60, s_oStage);

        new CGImage(oModePos.x + 500, oModePos.y + 40, s_oSpriteLibrary.getSprite('sugges_bg'), s_oStage);

        s_TextHide = []
        for (let index = 0; index < textInput.length; index++) {
            s_TextHide.push(new CText(oModePos.x + 500, oModePos.y - 50 + (50 * index), null, '', "MontserratBlack", "#fce48a", 30, s_oStage))
        }

        new CGImage(oModePos.x - 390, oModePos.y + 140, s_oSpriteLibrary.getSprite('game_4_bg'), s_oStage);

        new CGImage(oModePos.x + 500, oModePos.y + 350, s_oSpriteLibrary.getSprite('notifi_bg'), s_oStage);

        // Notifi text
        _notifiText = new createjs.Text('Bé hãy tìm các từ tiếng anh được gợi ý ở trên nhé' , "25px MontserratSemiBold", "#fff");
        _notifiText.textAlign = "center";
        _notifiText.lineHeight = 34;
        _notifiText.textBaseline = "alphabetic";
        _notifiText.lineWidth = 300
        _notifiText.x = oModePos.x + 500
        _notifiText.y = oModePos.y + 320
        s_oStage.addChild(_notifiText)

        // Create select button
        _selectText = []
        for (let index = 0; index < _selectTextLength; index++) {
            var col = index % 9;
            var row = parseInt(index / 9)
            var button = new TextHover((col * 60) , (row * 60), _gameContainer)
            button.addEventListenerWithParams(ON_MOUSE_OVER, this.selectTextMouseOver , this, { index, col, row });
            button.addEventListenerWithParams(ON_MOUSE_OUT, this.selectTextMouseOut , this, { index, col, row });
            _selectText.push(button)
        }
        _gameContainer.x = 330
        _gameContainer.y = oModePos.y - 110

        s_oStage.addChild(_gameContainer);

        _gameContainer.addEventListener("mousedown", function(evt) {
            mouseDown = true;
            
            _textSelectStart = _textSelectEnd

            s_Game4Screen2.checkTextSelect()
            // console.log(_textSelectStart)
        });
        
        _gameContainer.addEventListener("pressup", function(evt) {
            mouseDown = false;
            // console.log(_textSelectEnd)
            if (!s_Game4Screen2.checkResutl(_textSelect)) {
                s_Game4Screen2.textFailAnimation()
                _notifiText.text = "Bé chọn chưa đúng rồi. Cố lên nào bé !"
            } else {
                questionFind++;
                // playSound('game_4_checked', 1, true)
                s_Game4Screen2.changeTextSelect('')
                var questionCount = 0;
                for (let index = 0; index < textInput.length; index++) {
                    if (!textInput[index].status )
                        questionCount += 1
                }

                if (questionCount > 0) {
                    _notifiText.text = "Còn " + questionCount + " từ nữa! Bé hãy cố lên nào"
                }
                else {
                    _notifiText.text = "Chúc mừng bé!"
                    s_Game4Screen2.gameRefresh()
                }
            }
            s_Game4Screen2.clearTextSelect()
            
        });

        _gameContainer.addEventListener("pressmove", function(evt) {
        });

        _PassPartPanel = new PassPartPanel2();
        _FailedPartPanel = new FailedPartPanel();
        _PausePanel = new PausePanel(s_oStage);
        _ButtonPause.addEventListener(ON_MOUSE_UP, s_Game4Screen2.onPauseGame, this);

        s_Game4Screen2.gameRefresh()
        playSound('game_4', 1, true)
        this.refreshButtonPos();
    }

    this.gameRefresh = function () {

        if (gamePart > 0 && questionFind < 5) {
            _FailedPartPanel.show(_iScore)
            _bUpdate = false;
            stopSound('game_4')
            return;
        } else if (gamePart == 4 && questionFind == 5) {
            _PassPartPanel.show(_iScore)
            _bUpdate = false;
            stopSound('game_4')
            return;
        }

        gamePart++;
        questionFind = 0;

        while (true) {
            
            for (let index = 0; index < _selectText.length; index++) {
                _selectText[index].changeText(' ')
                _selectText[index].selectStatus(false)
                _selectText[index].selected(false)
            }

            if (s_Game4Screen2.mergeTextToArray()) {
                break;
            }
            console.log('LAI')
        }
        s_Game4Screen2.createWordHide()

        
        for (let index = 0; index < _selectText.length; index++) {
            if (_selectText[index].getText() == ' ')
                _selectText[index].changeText(this._randomString(1))
        }

        _iTimeElapsed = 60000;
        _bUpdate = true;
    }

    this.onPauseGame = function() {
        _PausePanel.show()
    }

    this.textFailAnimation = function () {
        s_TextSelect.pulseAnimation3(function () {
            s_Game4Screen2.changeTextSelect('')
        })
    }

    this.createWordHide = function () {
        var hideText = '****************';
        for (let index = 0; index < textInput.length; index++) {
            // console.log(textInput[index].text.substr(1))
            textInput[index].texthide = (textInput[index].text.substr(0,1) + hideText.substr(0, textInput[index].text.length - 2) + textInput[index].text.substr(-1)).toUpperCase()
            s_TextHide[index].changeText(textInput[index].texthide)
        }
    }

    this.checkResutl = function (text) {
        for (let index = 0; index < textInput.length; index++) {
            if (textInput[index].status === false && text.toUpperCase() == textInput[index].text.toUpperCase()) {

                _iScore += 10;
                playSound('bonus-collect', 1, false)

                textInput[index].status = true
                textInput[index].texthide = textInput[index].text
                s_TextHide[index].changeText(textInput[index].texthide.toUpperCase())

                // Danh dau cac o da dung
                for (let index2 = 0; index2 < _selectText.length; index2++) {
                    if (_selectText[index2].getSelectStatus()) {
                        _selectText[index2].selected(true)
                    }
                }
                return true;
            }
        }
        
        playSound('lose_game', 1, false)

        return false
    }

    this.mergeTextToArray = function () {

        // Chạy qua mảng lấy text
        for (let index = 0; index < textInput.length; index++) {
            var wordArr = textInput[index].text.split('')
            // console.log('Word length: ', wordArr.length)
            // Random vi tri bat ky cua mang
            var arrayRandomIndex;
            // Random chieu fill word
            var directionArr

            var loopCount = 10;

            while (true) {
                arrayRandomIndex = this.random(0, 80)
                directionArr = this.random(1,2)
                directionArr = directionArr === 1 ? 1 : 3
                
                var textOfTextIndex = _selectText[arrayRandomIndex].getText()
                // console.log("directionArr: ", directionArr)
                // Check vi tri hop le
                if ((textOfTextIndex == ' ' || textOfTextIndex == wordArr[0]) && this.checkDirection(arrayRandomIndex, directionArr, wordArr.length)) {
                    // Fill text theo chieu da chon
                    console.log("GOOD")

                    if (this.fillWordToArray(arrayRandomIndex, directionArr, textInput[index].text)) {
                        break
                    } else {
                        loopCount--;
                    }
                }

                if (loopCount < 0){
                    return false
                }
            }
            // break;
        }

        return true
    }

    this.fillWordToArray = function (beginIndex, direction, word, traial = true) {
        var col = beginIndex % 9;
        var row = parseInt(beginIndex / 9)
        var wordArr = word.split('')

        var traialResutl = true;

        // Chieu tu trai qua phai
        if (direction == 1) {
            for (let index = 0; index < wordArr.length; index++) {
                var colTemp = col + index
                var directToIndex = (row * 9) + colTemp
                if (traial) {
                    if (!(_selectText[directToIndex].getText() == ' ' || _selectText[directToIndex].getText() == wordArr[index])) {
                        traialResutl = false
                        break
                    }
                } else {
                    _selectText[directToIndex].changeText(wordArr[index].toUpperCase())
                    // _selectText[directToIndex].selectStatus(true)
                }
            }
        }
        
        // Chieu tu phai qua trai
        if (direction == 2) {
            for (let index = 0; index < wordArr.length; index++) {
                var colTemp = col - index
                var directToIndex = (row * 9) + colTemp
                if (traial) {
                    if (!(_selectText[directToIndex].getText() == ' ' || _selectText[directToIndex].getText() == wordArr[index])) {
                        traialResutl = false
                        break
                    }
                } else {
                    _selectText[directToIndex].changeText(wordArr[index].toUpperCase())
                    // _selectText[directToIndex].selectStatus(true)
                }
            }
        }
        
        // Chieu tu tren xuong duoi
        if (direction == 3) {
            for (let index = 0; index < wordArr.length; index++) {
                var rowTemp = row + index
                var directToIndex = (rowTemp * 9) + col
                if (traial) {
                    if (!(_selectText[directToIndex].getText() == ' ' || _selectText[directToIndex].getText() == wordArr[index])) {
                        traialResutl = false
                        break
                    }
                } else {
                    _selectText[directToIndex].changeText(wordArr[index].toUpperCase())
                    // _selectText[directToIndex].selectStatus(true)
                }
            }
        }
        
        // Chieu tu duoi len tren
        if (direction == 4) {
            for (let index = 0; index < wordArr.length; index++) {
                var rowTemp = row - index
                var directToIndex = (rowTemp * 9) + col
                if (traial) {
                    if (!(_selectText[directToIndex].getText() == ' ' || _selectText[directToIndex].getText() == wordArr[index])) {
                        traialResutl = false
                        break
                    }
                } else {
                    _selectText[directToIndex].changeText(wordArr[index].toUpperCase())
                    // _selectText[directToIndex].selectStatus(true)
                }
            }
        }

        if (traial && traialResutl) {
            s_Game4Screen2.fillWordToArray(beginIndex, direction, word, false)
        } else {
            return false
        }

        return true
    }

    this.checkDirection = function (index, direction, wordlength) {
        // Index to row and col
        var col = index % 9;
        var row = parseInt(index / 9)

        // console.log("Col: ", col, "Row: ", row)
        // Chieu tu trai qua phai
        if (direction == 1) {
            if (col + wordlength > 9) {
                return false;
            }
        }
        
        // Chieu tu phai qua trai
        if (direction == 2) {
            if (col - wordlength < 0) {
                return false;
            }
        }
        
        // Chieu tu tren xuong duoi
        if (direction == 3) {
            if (row + wordlength > 9) {
                return false;
            }
        }
        
        // Chieu tu duoi len tren
        if (direction == 4) {
            if (row - wordlength < 0) {
                return false;
            }
        }

        return true
    }

    this.random = function (min, max) {
        return Math.floor(Math.random() * max) + min
    }

    this.clearTextSelect = function () {
        for (let index = 0; index < _selectText.length; index++) {
            _selectText[index].selectStatus(false)
        }
    }

    this.changeTextSelect = function (text) {
        if (text !== '')
            s_TextSelect.changeText(text)
        else
            s_TextSelect.changeText(' ')
    }

    this.checkTextSelect = function() {
        
        this.clearTextSelect()
        if ((_textSelectStart && _textSelectEnd) && (_textSelectStart.col == _textSelectEnd.col || _textSelectStart.row == _textSelectEnd.row)  && mouseDown) {
            playSound("ball_tap", 1,false);
            var loopLength
            var direction
            var directionStart
            var directionEnd
            if (_textSelectStart.col == _textSelectEnd.col) {
                if (_textSelectStart.row > _textSelectEnd.row) {
                    loopLength = _textSelectStart.row - _textSelectEnd.row
                } else {
                    loopLength = _textSelectEnd.row - _textSelectStart.row
                }
                directionStart = _textSelectStart.row
                directionEnd = _textSelectEnd.row
                direction = 1
            } else if (_textSelectStart.row == _textSelectEnd.row) {
                if (_textSelectStart.col > _textSelectEnd.col) {
                    loopLength = _textSelectStart.col - _textSelectEnd.col
                } else {
                    loopLength = _textSelectEnd.col - _textSelectStart.col
                }
                directionStart = _textSelectStart.col
                directionEnd = _textSelectEnd.col
                direction = 2
            }

            _textSelect = '';

            if (directionStart > directionEnd) {
                for (let index = 0; index < loopLength + 1; index++) {
                    var indexArr = direction == 1 ? (directionStart - index) * 9 + (_textSelectStart.col) : _textSelectStart.row * 9 + (directionStart - index);
                    _selectText[indexArr].selectStatus(true)
                    _textSelect += _selectText[indexArr].getText()
                }
            } else {    
                for (let index = 0; index < loopLength + 1; index++) {
                    var indexArr = direction == 1 ? (directionStart + index) * 9 + (_textSelectStart.col) : _textSelectStart.row * 9 + (directionStart + index);
                    _selectText[indexArr].selectStatus(true)
                    _textSelect += _selectText[indexArr].getText()
                }
            }

            // Update Text select
            this.changeTextSelect(_textSelect)

        }
    }

    this.selectTextMouseOver = function(params) {
        // console.log("selectTextMouseOver", params)
        _textSelectEnd = params
        if (mouseDown) {
            s_Game4Screen2.checkTextSelect()
        }
    }
    this.selectTextMouseOut = function(params) {
        // console.log("selectTextMouseOut", params)
    }

    this.update = function() {
        _Scores.changeText(_iScore)

        if (!_bUpdate) { return; }
        //REFRESH TIME BAR
        _iTimeElapsed -= s_iTimeElaps;
        if (_iTimeElapsed < 0){
            _bUpdate = false;
            this.gameRefresh()
        }else{
            // Change time text
            _Time.changeText(formatTime(_iTimeElapsed))
            // Change time process
            _Time.updateProcess((_iTimeElapsed / 60000) * 100 )
        }
    }
    

    this._randomString = function (length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    this._refreshInput = function (word) {
        
        _inputWidth = word.length * 100
        //Clear text and visible
        for (let index = 0; index < _inputLength; index++) {
            _input[index].changeText('')
            _input[index].setVisible(false)
        }
        for (let index = 0; index < word.length; index++) {
            _input[index].setPosition( 1550 - (_inputWidth/2) + (100 * index) ,s_iOffsetY + 260)
            _input[index].setVisible(true)
        }
    }

    this._findArray = function (value, array) {
        for (let index = 0; index < array.length; index++) {
            if (array[index] == value) {
                return true
            }
        }
        return false
    }

    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }
        _ButtonCart.setPosition(_pCartPos.x - s_iOffsetX - 260,s_iOffsetY + _pCartPos.y);
        _ButtonPause.setPosition(_pPausePos.x - s_iOffsetX - 130,s_iOffsetY + _pCartPos.y);
        _Scores.setPosition(s_iOffsetX + 970, s_iOffsetY + 80);
        _Time.setPosition(s_iOffsetX + 400, s_iOffsetY + 80);
    }

    this.unload = function() {
        stopSound('game_4');
        s_Game4Screen2 = null;
        s_oStage.removeAllChildren();
    }    

    s_Game4Screen2 = this;
    this.init()
}

var s_Game4Screen2 = null;


function TextHover (iXPos, iYPos, gameContainer) {
    var _TextBg;
    var _oButton;
    var _oText;
    var _select = false
    
    var _aCbCompleted;
    var _aCbOwner;
    var _oParams;
    var _bDisable;
    var _evHover = false;
    var _TextSelected;


    this._init = function (iXPos, iYPos, gameContainer) {

        _aCbCompleted=new Array();
        _aCbOwner =new Array();

        var oSprite = s_oSpriteLibrary.getSprite('text_select')

        _TextBgSelect = createBitmap(s_oSpriteLibrary.getSprite('text_select_bg'));
        _TextSelected = createBitmap(s_oSpriteLibrary.getSprite('text_selected'));
        _TextBg = createBitmap(oSprite);
        _iWidth = oSprite.width;
        _iHeight = oSprite.height;

        _oText = new createjs.Text(' ',"45px BalooBhaina-ExtraBold", "#fffec9");
        var oBounds = _oText.getBounds();
        _oText.textAlign = "center";
        _oText.textBaseline = "alphabetic";  
        _oText.lineWidth = _iWidth *0.9;
        _oText.shadow = new createjs.Shadow('#4e1b13', -3, 4, 5);
        
        _oText.x = oSprite.width/2;
        _oText.y = Math.floor((oSprite.height)/2) +(oBounds.height/3);

        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;

        _oButton.addChild(_TextSelected, _TextBg, _oText, _TextBgSelect);

        gameContainer.addChild(_oButton);

        _TextBg.visible = false
        _TextSelected.visible = false

        // _oButton.addEventListener("mouseover", function() {
        //     _TextBg.visible = true
        //     console.log('mouseover: ',_oButton.x, _oButton.y)
        //     // s_oStage.update();
        // });
        
        // _oButton.addEventListener("mouseout", function() {
        //     if (!_select) {
        //         _TextBg.visible = false   
        //         console.log('mouseout', _oButton.x, _oButton.y)
        //     }
        //     // s_oStage.update();
        // });

        this._initListener()
    }

    this.selectStatus  = function (status) {
        if (status) {
            _select = true
            _TextBg.visible = true;
            _oButton.scaleX = 1.1;
            _oButton.scaleY = 1.1;
        } else {
            _select = false
            _TextBg.visible = false;
            _oButton.scaleX = 1;
            _oButton.scaleY = 1;
        }
    }
    
    this.selected  = function (status) {
        if (status) {
            _select = true
            _TextSelected.visible = true;
            _oButton.scaleX = 1.1;
            _oButton.scaleY = 1.1;
        } else {
            _select = false
            _TextSelected.visible = false;
            _oButton.scaleX = 1;
            _oButton.scaleY = 1;
        }
    }

    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,oParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        
        _oParams = oParams;
    };

    this.buttonMouseOver = function(){
        if(_bDisable){
            return;
        }

        if (!_evHover) {
            _evHover = true;
        } else {
            return;
        }
        
        _TextBg.visible = true;
        _TextBg.alpha = 1;
        _oButton.scaleX = 1.1;
        _oButton.scaleY = 1.1;

        if(_aCbCompleted[ON_MOUSE_OVER]){
            _aCbCompleted[ON_MOUSE_OVER].call(_aCbOwner[ON_MOUSE_OVER],_oParams);
        }
    };

    this.buttonMouseOut = function(){
        if(_bDisable){
            return;
        }

        if (_evHover) {
            _evHover = false;
        } else {
            return;
        }

        if (!_select) {
            _TextBg.visible = false;
            // _TextBg.alpha = 0.5;
            _oButton.scaleX = 1;
            _oButton.scaleY = 1;
        }

       if(_aCbCompleted[ON_MOUSE_OUT]){
           _aCbCompleted[ON_MOUSE_OUT].call(_aCbOwner[ON_MOUSE_OUT], _oParams);
       }
    };

    this._initListener = function(){
        _TextBgSelect.on("mouseover", this.buttonMouseOver);
        _TextBgSelect.on("mouseout" , this.buttonMouseOut);      
    };

    this.changeText = function (text) {
        _oText.text = text
    }
    
    this.getText = function () {
        return _oText.text
    }

    this.getSelectStatus = function () {
        return _select;
    }

    this.changeSelectStage = function (stage) {
        _select = stage
    }

    this._init(iXPos, iYPos, gameContainer)

    return this;
}