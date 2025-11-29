//@author: Iremnur Ugur

// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.

function composite( bgImg, fgImg, fgOpac, fgPos )
{
	const fgImgWidth = fgImg.width;
	const fgImgHeight = fgImg.height;
	
	const bgImgWidth = bgImg.width;
	const bgImgHeight = bgImg.height;
	
	const bgData = bgImg.data, fgData = fgImg.data;
	
	for( let y=0; y<fgImgHeight; y+=1 )
	{
		//find pixel y axis position in the background image
		const posBgY = y + fgPos.y;
		//if y-axis position is outside the bg image, pass that column
		if (posBgY < 0 || posBgY >= bgImgHeight) continue;
		
		for( let x=0; x<fgImgWidth; x+=1 )
		{
			//find pixel x axis position in the background image
			const posBgX = x + fgPos.x;
			//if x-axis position is outside the bg image, pass that row
			if (posBgX < 0 || posBgX >= bgImgWidth) continue;
			
			//get the index of the current pixel in the background image data array
			const bgIndex = (posBgY * bgImgWidth + posBgX) * 4;
			//get the index of the current pixel in the foreground image data array
			const fgIndex = (y * fgImgWidth + x) * 4;
			
			//calculate the alpha value of the foreground image
			const alphaFg = (fgData[fgIndex+3]/255.0) * fgOpac;
			
			//set bg image colors
			bgData[bgIndex] = bgImg.data[bgIndex] * (1 - alphaFg) + fgData[fgIndex] * alphaFg;
			bgData[bgIndex+1] = bgData[bgIndex+1] * (1 - alphaFg) + fgData[fgIndex+1] * alphaFg;
			bgData[bgIndex+2] = bgData[bgIndex+2] * (1 - alphaFg) + fgData[fgIndex+2] * alphaFg;
		}
	}
}