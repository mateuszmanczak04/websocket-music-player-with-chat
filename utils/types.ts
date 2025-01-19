export type T_Song = {
	id: string;
	title: string;
	cover: string;
	audio: string;
	createdAt: Date;
	updatedAt: Date;
};

export type T_PlayerState = {
	currentSongId: string;
	currentProgress: number;
	isPlaying: boolean;
};

export type T_User = {
	id: string;
	username: string;
	lastActive: Date;
};

export type T_Message = {
	id: string;
	content: string;
	username: string;
};
