export function sanitizeRoomToChannel({ name, id, userCount, topic }) {
  return {
    id,
    isMember: true,
    name,
    main: false,
    members: userCount,
    meta: { topic }
  }
}

export function sanitizeRoomToDM({ name, id, userCount, topic }) {
  console.log(room)

  return {
    id,
    isMember: true,
    name,
    main: false,
    members: userCount,
    meta: { topic }
  }
}

/*
_.forEach(readableDMs, ({ is_open: isOpen, user, id }) => {
  const { name, presence, images, handle } = users[user]
  dms[id] = ({
    isOpen,
    id,
    presence,
    name: `@${handle}`,
    handle,
    image: _.last(images),
    user,
    meta: { members: presence, topic: name }
  })
})
 */

/*
{
  avatarUrl: "https://avatars-02.gitter.im/group/i/57542d60c43b8c601977c2b2",
  githubType: "REPO"
  groupId: "57542d60c43b8c601977c2b2"
  id: "55d2f3ac0fc9f982beadbdf8"
  lastAccessTime: "2016-08-05T08:02:07.607Z"
  lurk: false
  mentions: 0
  name: "jaruba/PowderPlayer"
  noindex: false
  oneToOne: false
  public: true
  roomMember: true
  security: "PUBLIC"
  tags: Array[0]
  topic: "Hybrid between a Torrent Client and a Player (torrent streaming)"
  unreadItems: 0
  uri: "jaruba/PowderPlayer"
  url: "/jaruba/PowderPlayer"
  userCount: 60
}
*/
