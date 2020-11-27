#import <Foundation/Foundation.h>
#import "MRYIPCCenter.h"

#import "Obj.h"

#define c(a) NSClassFromString(@#a)

@implementation IPCTextWatcher {
	/// This is a MCRYIPC center that libsmserver contacts whenever a new text is received.
	MRYIPCCenter* _center;
}

+ (instancetype)sharedInstance {
	static dispatch_once_t onceToken = 0;
	__strong static IPCTextWatcher* sharedInstance = nil;
	dispatch_once(&onceToken, ^{
		sharedInstance = [[self alloc] init];
	});
	return sharedInstance;
}

- (instancetype)init {
	if ((self = [super init])) {
		_center = [MRYIPCCenter centerNamed:@"com.ianwelker.smserverHandleText"];
		[_center addTarget:self action:@selector(handleReceivedTextWithCallback:)];
		[_center addTarget:self action:@selector(handlePartyTypingWithCallback:)];
	}
	return self;
}

- (void)handleReceivedTextWithCallback:(NSString *)guid {
	/// This is the function that is called when a new text is received.
	/// _setTexts is a block that is set somewhere around line 554 in ContentView.swift, in loadFuncs().
	_setTexts(guid);
}

- (void)handlePartyTypingWithCallback:(NSString *)chat_id {
	/// This is called when someone else starts typing
	/// _setTyping is a block that is set somewhere around line 559 in ContentView.swift, in loadFuncs().
	_setTyping(chat_id);
}

@end

@implementation IWSSender

- (id)init {
	if (self = [super init]) {
		self.center = [MRYIPCCenter centerNamed:@"com.ianwelker.smserver"];
		/// TODO: Find a way to add an NSNotificationCenter observer for the name "__kIMChatRegistryMessageSentNotification"
	}
	return self;
}

- (void)launchMobileSMS {
	[self.center callExternalVoidMethod:@selector(launchSMS) withArguments:nil];
}

- (uid_t)setUID {
	setuid(0);
	setgid(0);

	return getuid() + getgid();
}

- (void)sendIPCText:(NSString *)body withSubject:(NSString *)subject toAddress:(NSString *)address withAttachments:(NSArray *)paths {
	[self.center callExternalVoidMethod:@selector(sendText:) withArguments:@{@"body": body, @"subject": subject, @"address": address, @"attachment": paths}];
}

- (void)markConvoAsRead:(NSString *)chat_id {
	NSArray* chats = [chat_id componentsSeparatedByString:@","]; /// To allow marking multiple convos as read
	for (NSString* chat in chats) {
		[self.center callExternalVoidMethod:@selector(setAllAsRead:) withArguments:chat];
	}
}

- (void)sendReaction:(NSNumber *)reaction forGuid:(NSString *)guid inChat:(NSString *)chat {
	[self.center callExternalVoidMethod:@selector(sendReaction:) withArguments:@{@"reaction": reaction, @"guid": guid, @"chat": chat}];
}

- (void)sendTyping:(BOOL)isTyping forChat:(NSString *)chat {
	NSBundle* imcore = [[NSBundle alloc] initWithPath:@"/System/Library/PrivateFrameworks/IMCore.framework"];
	[imcore load];

	CKConversationList* sharedList = [c(CKConversationList) sharedConversationList];
	CKConversation* convo = [sharedList conversationForExistingChatWithGroupID:chat];

	[convo setLocalUserIsTyping:isTyping];
}

/// This is not being used, but I am leaving it here for future versions in case I figure out how to make it work well.
/// The issue right now is that this code works when I sign it with the com.apple.messages.pinned
/// (or something like that) entitlement, but I can't have Xcode automatically sign it with that, so I'd have to
/// manually codesign each time that I want to debug. That would be a massive hassle so I'm not going to do it until
/// I find an easier solution

/*- (NSArray *)getPinnedChats {
 NSBundle* imcore = [[NSBundle alloc] initWithPath:@"/System/Library/PrivateFrameworks/IMCore.framework"];
 [imcore load];

 IMDaemonController* controller = [c(IMDaemonController) sharedController];
 __block NSArray* pins = [NSArray array];

 if ([controller connectToDaemon]) {
	[controller sendQueryWithReply:NO query:^{
		if ([[NSProcessInfo processInfo] operatingSystemVersion].majorVersion >= 14) {
			IMPinnedConversationsController* pinnedController = [c(IMPinnedConversationsController) sharedInstance];
			NSOrderedSet* set = [pinnedController pinnedConversationIdentifierSet];

			pins = [set array];
		}
	}];
 }

 return pins;
}*/

@end

