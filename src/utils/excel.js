import * as xlsx from 'xlsx/xlsx.mjs';

function extractUsernamesFromSheet(worksheet) {
	const worksheetSize = worksheet['!ref'];
	const range = xlsx.utils.decode_range(worksheetSize);

	let usernames = [];

	for (let R = range.s.r; R <= range.e.r; ++R) {
		for (let C = range.s.c; C <= range.e.c; ++C) {

		 	let cell_address = { c: C, r: R };
		  	let cell_ref = xlsx.utils.encode_cell(cell_address);
		  	let cell = worksheet[cell_ref];
			
			if (cell && cell.w.startsWith('@')) {
				const username = cell.w.trim();
				usernames.push(username.replace('@', ''));
			}
		}
	}

	return usernames;
}

function extractUsernames(fileBuffer) {
	const workbook = xlsx.read(fileBuffer);

	let usernames = [];
	for (let sheet in workbook.Sheets) {
		const usernamesFromSheet = extractUsernamesFromSheet(workbook.Sheets[sheet]);
		usernames = usernames.concat(usernamesFromSheet);
	}
				
	return usernames;
}

export { extractUsernames };