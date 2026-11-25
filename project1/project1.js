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
			
			const foregroundAlpha = fgData[fgIndex + 3] / 255 * fgOpac;
			if (foregroundAlpha === 0) continue;

			const backgroundAlpha = bgData[bgIndex + 3] / 255;
			const backgroundWeight = backgroundAlpha * (1 - foregroundAlpha);
			const outputAlpha = foregroundAlpha + backgroundWeight;

			// ImageData stores RGB channels without premultiplying by alpha.
			for (let channel = 0; channel < 3; channel += 1) {
				bgData[bgIndex + channel] = (
					fgData[fgIndex + channel] * foregroundAlpha +
					bgData[bgIndex + channel] * backgroundWeight
				) / outputAlpha;
			}
			bgData[bgIndex + 3] = outputAlpha * 255;
		}
	}
}
