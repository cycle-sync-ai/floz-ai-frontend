interface Meeting {
    _id?: string;
    date?: Date;
    audioURL?: string;
    summary?: string;
    members?: Array<any>;
    projectId?: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export type {Meeting}
