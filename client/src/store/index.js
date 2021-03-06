import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../api'

import AuthContext from '../auth'

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_TOP5LISTS: "LOAD_TOP5LISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_PUBLISHABLE: "SET_PUBLISHABLE"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        top5Lists: [],
        currentList: null,
        newListCounter: 0,
        publishable: false,
        listMarkedForDeletion: null
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    top5Lists: payload.top5Lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    publishable: false,
                    listMarkedForDeletion: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    publishable: false,
                    listMarkedForDeletion: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    publishable: false,
                    listMarkedForDeletion: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_TOP5LISTS: {
                return setStore({
                    top5Lists: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    publishable: false,
                    listMarkedForDeletion: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    publishable: false,
                    listMarkedForDeletion: payload
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    publishable: false,
                    listMarkedForDeletion: null
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    publishable: false,
                    listMarkedForDeletion: null
                });
            }

            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_PUBLISHABLE: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    publishable: payload,
                    listMarkedForDeletion: null
                });
            }
            default:
                return store;
        }
    }

    store.clearTop5Lists = async function(){
        storeReducer({
            type: GlobalStoreActionType.LOAD_TOP5LISTS,
            payload: null
        });
    }

    store.publishCurrentList = async function(){
        let currentList = store.currentList;
        currentList.published = true;
        currentList.publishDate = new Date();
        store.updateCurrentList();

        try {
            const response = await api.getTop5CommunityList(currentList.name);
            if(response.data.success){
                let communityList = response.data.top5List;   
                let s = 5;
                for(let i = 0; i < currentList.items.length;i++){
                    if(communityList.communityScore[currentList.items[i]])
                        communityList.communityScore[currentList.items[i]] += s;
                    else
                        communityList.communityScore[currentList.items[i]] = s
                    s--;
                }

                let itemScores = communityList.communityScore;

                let sortable = [];
                for (let item in itemScores) {
                    sortable.push([item, itemScores[item]]);
                }

                sortable.sort(function(a, b) {
                    return b[1] - a[1];
                });

                let itemScoresSorted = {}
                sortable.forEach(function(item){
                    itemScoresSorted[item[0]]=item[1]
                })

                communityList.communityScore = itemScoresSorted;
                
                store.updateList(communityList._id, communityList);
            } 
        } catch(err){
            let community = {};
            let s = 5;
            for(let i = 0; i < currentList.items.length;i++){
                community[currentList.items[i]] = s;
                s--;
            }
            
            let payload = {
                name: currentList.name,
                items: currentList.items,
                ownerEmail: currentList.ownerEmail,
                user: "@community",
                likes: [],
                dislikes: [],
                views: 0,
                comments: [],
                published: true,
                community: true,
                communityScore: community
            };
            const response2 = await api.createTop5List(payload);
            if (response2.data.success) {
                console.log("Community List created");
            }
        }


        history.push("/home");
    }

    // changes name of current list
    store.changeListName = async function (id, newName) {
        store.currentList.name = newName;
        store.updateCurrentList();
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        
        history.push("/home");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        let payload = {
            name: newListName,
            items: ["?", "?", "?", "?", "?"],
            ownerEmail: auth.user.email,
            user: auth.user.userName,
            likes: [],
            dislikes: [],
            views: 0,
            comments: [],
            published: false,
            community: false,
        };

        const response = await api.createTop5List(payload);
        if (response.data.success) {
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/top5list/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // loads current user's list
    store.loadIdNamePairs = async function () {
        try{
            const response = await api.getTop5ListsByUser(auth.user.userName);
            if (response.data.success) {
                
                storeReducer({
                    type: GlobalStoreActionType.LOAD_TOP5LISTS,
                    payload: response.data.top5Lists
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }catch(err){

        }
    }

    store.loadAllLists = async function () {
        try{
            const response = await api.getTop5Lists();
            if (response.data.success) {
                let allLists = response.data.top5Lists;
                const newTop5Lists = allLists.filter(value => !value.community).sort(function(a, b){return new Date(b.publishDate) - new Date(a.publishDate)});;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_TOP5LISTS,
                    payload: newTop5Lists
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }catch(err){

        }
    }

    store.loadAllCommunityLists = async function() {
        try{
            const response = await api.getTop5Lists();
            if (response.data.success) {
                let allLists = response.data.top5Lists;
                const newTop5Lists = allLists.filter(value => value.community).sort(function(a, b){return new Date(b.updatedAt) - new Date(a.updatedAt)});
                storeReducer({
                    type: GlobalStoreActionType.LOAD_TOP5LISTS,
                    payload: newTop5Lists
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }catch(err){

        }
    }

    //loads all lists by list name
    store.loadListsByName = async function(name){
        try{
            const response = await api.getTop5ListsByName(name);
            if (response.data.success) {
                let userLists = response.data.top5Lists;
                const newTop5Lists = userLists.filter(value => !value.community);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_TOP5LISTS,
                    payload: newTop5Lists
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }catch(err){

        }
    }


    //loads user's lists by name
    store.loadUserListsByName = async function(name){
        try{
            const response = await api.getTop5ListsByUser(auth.user.userName);
            if (response.data.success) {
                let allUserLists = response.data.top5Lists;
                const newTop5Lists = allUserLists.filter(value => value.name.toLowerCase().startsWith(name.toLowerCase()));
                storeReducer({
                    type: GlobalStoreActionType.LOAD_TOP5LISTS,
                    payload: newTop5Lists
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }catch(err){

        }
    }

    store.loadListsByUser = async function(user) {
        try{
            const response = await api.getTop5ListsByUser(user);
            if (response.data.success) {
                let userLists = response.data.top5Lists;
                const newTop5Lists = userLists.filter(value => value.published);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_TOP5LISTS,
                    payload: newTop5Lists
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }catch(err){

        }
    }

    //loads community lists that start with name
    store.loadCommunityListsByName = async function(name){
        try{
            const response = await api.getTop5ListsByName(name);
            if (response.data.success) {
                let userLists = response.data.top5Lists;
                const newTop5Lists = userLists.filter(value => value.community);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_TOP5LISTS,
                    payload: newTop5Lists
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }catch(err){

        }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }
    }

    store.deleteList = async function (listToDelete) {
        try{
            let response = await api.deleteTop5ListById(listToDelete._id);
            if (response.data.success) {
                store.loadIdNamePairs();
                history.push("/home");
                
                store.updateCommunityList(listToDelete);
            }
        }catch(err){
            store.loadIdNamePairs();
            history.push("/home");
        }
    }

    store.updateCommunityList = async function(listDeleted) {
        try {
            const response = await api.getTop5CommunityList(listDeleted.name);
            if(response.data.success){
                let communityList = response.data.top5List;   
                let s = 5;
                for(let i = 0; i < listDeleted.items.length;i++){
                    if(communityList.communityScore[listDeleted.items[i]])
                        communityList.communityScore[listDeleted.items[i]] -= s;
                    s--;
                }

                let itemScores = communityList.communityScore;

                let sortable = [];
                for (let item in itemScores) {
                    sortable.push([item, itemScores[item]]);
                }

                sortable.sort(function(a, b) {
                    return b[1] - a[1];
                });

                let itemScoresSorted = {}
                sortable.forEach(function(item){
                    itemScoresSorted[item[0]]=item[1]
                })

                communityList.communityScore = itemScoresSorted;
                console.log(itemScoresSorted[Object.keys(itemScoresSorted)[4]]);
                store.updateList(communityList._id, communityList);

                if(itemScoresSorted[Object.keys(itemScoresSorted)[4]] === 0){
                    store.deleteList(communityList);
                    console.log("deleted list");
                }
            } 
        } catch(err){
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    
    store.setCurrentList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: top5List
                });
                //history.push("/top5list/" + top5List._id);
            }
        }
    }

    store.updateItem = function (index, newItem) {
        store.currentList.items[index] = newItem;
        store.updateCurrentList();
    }

    store.updateCurrentList = async function () {
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: store.currentList
            });
        }
    }


    store.updateList = async function (id, top5List) {
        const response = await api.updateTop5ListById(id, top5List);
        if (response.data.success) {
            console.log("updated");
        }
    }

    store.setPublishable = function (publishable) {
        storeReducer({
            type: GlobalStoreActionType.SET_PUBLISHABLE,
            payload: publishable
        });
    }

    store.checkIfPublishable = async function(listName){
        let items = store.currentList.items;
        let publishable = true;

        if(listName){
            try{
                const response = await api.getTop5ListsByUser(auth.user.userName);
                if (response.data.success) {
                    let userLists = response.data.top5Lists;
                    const publishedListsWithName = userLists.filter(value => (value.published && (value.name === listName)));
                    if(publishedListsWithName.length !== 0){
                        publishable = false;
                    } else publishable = true;
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }catch(err){

            }
        }

        if(publishable){
            for(let i = 0; i < 5;i++){
                if(items[i] === "" || items[i] === "?"){
                    publishable = false;
                    break;
                }
            }
            //checking duplicates
            if(publishable)
                publishable = (new Set(items)).size === items.length;
            
            if(publishable) 
                store.setPublishable(true) 
            else store.setPublishable(false);
        } else store.setPublishable(false);
    }

    store.sortLists = function(sortBy){

        if(sortBy === "dateDsc"){
            const sortedList = store.top5Lists.sort(function(a, b)
            {
                if(!a.community)
                    return new Date(b.publishDate) - new Date(a.publishDate);
                else
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
            });
            storeReducer({
                type: GlobalStoreActionType.LOAD_TOP5LISTS,
                payload: sortedList
            });
        }

        if(sortBy === "dateAsc"){
            const sortedList = store.top5Lists.sort(function(a, b)
            {
                if(!a.community)
                    return new Date(a.publishDate) - new Date(b.publishDate);
                else
                    return new Date(a.updatedAt) - new Date(b.updatedAt);
            });
            
            storeReducer({
                type: GlobalStoreActionType.LOAD_TOP5LISTS,
                payload: sortedList
            });
        }

        if(sortBy === "likes"){
            const sortedList = store.top5Lists.sort(function(a, b){return b.likes.length - a.likes.length});
            storeReducer({
                type: GlobalStoreActionType.LOAD_TOP5LISTS,
                payload: sortedList
            });
        }

        if(sortBy === "dislikes"){
            const sortedList = store.top5Lists.sort(function(a, b){return b.dislikes.length - a.dislikes.length});
            storeReducer({
                type: GlobalStoreActionType.LOAD_TOP5LISTS,
                payload: sortedList
            });
        }

        if(sortBy === "views"){
            const sortedList = store.top5Lists.sort(function(a, b){return b.views - a.views});
            storeReducer({
                type: GlobalStoreActionType.LOAD_TOP5LISTS,
                payload: sortedList
            });
        }

    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };