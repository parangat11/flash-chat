export const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

export const isOtherSenderLastInBlock = (
    messages,
    currentMessage,
    idx,
    userId
) => {
    return (
        idx < messages.length - 1 &&
        (messages[idx + 1].sender._id !== currentMessage.sender._id ||
            messages[idx + 1].sender._id === undefined) &&
        messages[idx].sender._id !== userId
    );
};

export const isLastMessageOfOther = (messages, idx, userId) => {
    return (
        idx === messages.length - 1 &&
        messages[idx].sender._id &&
        messages[idx].sender._id !== userId
    );
};

export const isOtherSenderMargin = (messages, m, i, userId) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};

export const isSameUser = (messages, message, idx) => {
    return idx > 0 && messages[idx - 1].sender._id === message.sender._id;
};
