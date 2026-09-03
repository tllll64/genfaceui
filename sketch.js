let canvas;
let currentSketchInstance = null;

// 初始化空画布
function setup() {
    canvas = createCanvas(400, 400);
    canvas.parent('expression-container');
    noLoop(); // 停止默认的绘制循环
}

function draw() {
    // 保持空白，所有绘制由动态代码控制
}

// 更新表情的函数
function updateExpression(code) {
    try {
        console.log('Received new p5.js code:', code);
        
        // 如果存在旧的实例，清理它
        if (currentSketchInstance) {
            currentSketchInstance.remove();
        }

        // 格式化代码字符串，将注释转换为换行
        const formattedCode = code
            .replace(/\/\/ /g, '\n// ')  // 在注释前添加换行
            .replace(/; /g, ';\n')       // 在语句后添加换行
            .trim();                     // 移除首尾空白
        
        console.log('Formatted code:', formattedCode);

        // 创建新的 p5 实例的代码包装
        const sketchCode = `
            new p5(function(p) {
                p.setup = function() {
                    const canvas = p.createCanvas(400, 400);
                    canvas.parent('expression-container');
                    p.angleMode(p.DEGREES);
                };

                p.draw = function() {
                    try {
                        p.background(255);
                        p.translate(p.width/2, p.height/2);
                        ${formattedCode}
                    } catch (e) {
                        console.error('Error in p5.js draw function:', e);
                        console.error('Code that caused error:', formattedCode);
                    }
                };
            }, 'expression-container');
        `;

        console.log('Final sketch code:', sketchCode);
        
        // 执行新的 sketch 代码
        currentSketchInstance = eval(sketchCode);
        
        console.log('Successfully created new p5 instance');
    } catch (error) {
        console.error('Error creating p5 instance:', error);
        console.error('Code that caused error:', code);
        // 错误时显示空白画布
        clear();
    }
}

// 暴露给全局以供socket.io调用
window.updateExpression = updateExpression;

// 添加一个更简单的测试函数
window.testExpression = function() {
    const testCode = `
        p.fill(255, 223, 196);
        p.stroke(0);
        p.ellipse(0, 0, 300, 300);
        
        p.fill(255);
        p.stroke(0);
        p.ellipse(-70, -50, 60, 40);
        p.ellipse(70, -50, 60, 40);
        
        p.fill(0);
        p.ellipse(-70, -50, 30, 30);
        p.ellipse(70, -50, 30, 30);
        
        p.stroke(0);
        p.strokeWeight(8);
        p.line(-110, -90, -30, -70);
        p.line(30, -70, 110, -90);
        
        p.noFill();
        p.stroke(0);
        p.strokeWeight(8);
        p.arc(0, 60, 80, 50, 0, 180);
    `.trim();
    
    console.log('Testing with code:', testCode);
    updateExpression(testCode);
}
