export type Song = {
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
