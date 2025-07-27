// Converted to a functional component with hooks.
import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  UIManager
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import reject from 'lodash/reject';
import find from 'lodash/find';
import get from 'lodash/get';

import styles, { colorPack } from './styles';

// Enable layout animation
if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const defaultSearchIcon = (
  <Icon
    name="magnify"
    size={20}
    color={colorPack.placeholderTextColor}
    style={{ marginRight: 10 }}
  />
);

const MultiSelect = (props) => {
  const [selector, setSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    selectedItems = [],
    single = false,
    uniqueKey = '_id',
    onSelectedItemsChange,
    items = [],
    displayKey = 'name',
    onAddItem = () => {},
    onChangeInput = () => {},
    onClearSelector = () => {},
    onToggleList = () => {},
    removeSelected = false,
    noItemsText = 'No items to display.',
    canAddItems = false,
    flatListProps = {},
    searchIcon = defaultSearchIcon,
    searchInputPlaceholderText = 'Search',
    searchInputStyle = { color: colorPack.textPrimary },
    submitButtonColor = '#CCC',
    submitButtonText = 'Submit',
    hideSubmitButton = false,
    hideDropdown = false,
    fontFamily = '',
    styleMainWrapper = {},
    styleSelectorContainer,
    styleInputGroup,
    styleItemsContainer,
    styleListContainer,
    styleRowList,
    fontSize = 14,
    textColor = colorPack.textPrimary,
    fixedHeight = false,
    hideTags = false,
    altFontFamily = '',
    tagBorderColor = colorPack.primary,
    tagTextColor = colorPack.primary,
    tagRemoveIconColor = colorPack.danger,
    styleTextTag,
    styleDropdownMenu,
    styleDropdownMenuSubsection,
    styleTextDropdown,
    styleTextDropdownSelected,
    styleIndicator,
    selectedItemFontFamily = '',
    selectedItemTextColor = colorPack.primary,
    itemFontFamily = '',
    itemTextColor = colorPack.textPrimary,
    itemFontSize = 16,
    selectedItemIconColor = colorPack.primary,
    textInputProps = {},
    filterMethod,
    selectText = 'Select',
    selectedText = 'selected',
  } = props;

  const _findItem = useCallback(
    (itemKey) => find(items, (item) => item[uniqueKey] === itemKey) || {},
    [items, uniqueKey]
  );

  const _itemSelected = useCallback(
    (item) => selectedItems.includes(item[uniqueKey]),
    [selectedItems, uniqueKey]
  );

  const _toggleItem = (item) => {
    if (single) {
      onSelectedItemsChange([item[uniqueKey]]);
      _submitSelection();
    } else {
      const exists = _itemSelected(item);
      const newItems = exists
        ? reject(selectedItems, (i) => item[uniqueKey] === i)
        : [...selectedItems, item[uniqueKey]];
      onSelectedItemsChange(newItems);
    }
  };

  const _getRow = (item) => (
    <TouchableOpacity
      disabled={item.disabled}
      onPress={() => _toggleItem(item)}
      style={[styleRowList, { paddingLeft: 20, paddingRight: 20 }]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          style={{
            flex: 1,
            fontSize: 16,
            paddingTop: 5,
            paddingBottom: 5,
            color: item.disabled ? 'grey' : _itemSelected(item) ? selectedItemTextColor : itemTextColor,
            fontFamily: _itemSelected(item)
              ? selectedItemFontFamily
              : itemFontFamily,
          }}
        >
          {item[displayKey]}
        </Text>
        {_itemSelected(item) && (
          <Icon
            name="check"
            style={{ fontSize: 20, color: selectedItemIconColor }}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const _submitSelection = () => {
    setSelector(false);
    setSearchTerm('');
  };

  const _renderItems = () => {
    let renderItems = searchTerm
      ? _filterItems(searchTerm)
      : items;

    if (removeSelected) {
      renderItems = renderItems.filter(
        (item) => !selectedItems.includes(item[uniqueKey])
      );
    }

    const itemList = renderItems.length ? (
      <FlatList
        data={renderItems}
        extraData={selectedItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => _getRow(item)}
        nestedScrollEnabled
        {...flatListProps}
      />
    ) : (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          style={{
            flex: 1,
            marginTop: 20,
            textAlign: 'center',
            color: colorPack.danger,
            fontFamily,
          }}
        >
          {noItemsText}
        </Text>
      </View>
    );

    return (
      <View style={styleListContainer}>{itemList}</View>
    );
  };

  const _filterItems = (term) => {
    const regex =
      filterMethod === 'full'
        ? new RegExp(term.trim(), 'i')
        : new RegExp(term.trim().split(/[\s\-:]+/).join('|'), 'i');

    return items.filter((item) => regex.test(get(item, displayKey)));
  };

  return (
    <View style={[{ flexDirection: 'column' }, styleMainWrapper]}>
      {selector ? (
        <View style={[styles.selectorView(fixedHeight), styleSelectorContainer]}>
          <View style={[styles.inputGroup, styleInputGroup]}>
            {searchIcon}
            <TextInput
              autoFocus
              onChangeText={(val) => {
                onChangeInput(val);
                setSearchTerm(val);
              }}
              placeholder={searchInputPlaceholderText}
              placeholderTextColor={colorPack.placeholderTextColor}
              underlineColorAndroid="transparent"
              style={[searchInputStyle, { flex: 1 }]}
              value={searchTerm}
              {...textInputProps}
            />
            {hideSubmitButton && (
              <TouchableOpacity onPress={_submitSelection}>
                <Icon
                  name="menu-down"
                  style={[styles.indicator, { paddingLeft: 15, paddingRight: 15 }, styleIndicator]}
                />
              </TouchableOpacity>
            )}
            {!hideDropdown && (
              <Icon
                name="arrow-left"
                size={20}
                onPress={() => {
                  setSelector(false);
                  onClearSelector();
                }}
                color={colorPack.placeholderTextColor}
                style={{ marginLeft: 5 }}
              />
            )}
          </View>
          <View style={{ flexDirection: 'column', backgroundColor: '#fafafa' }}>
            <View style={styleItemsContainer}>{_renderItems()}</View>
            {!single && !hideSubmitButton && (
              <TouchableOpacity
                onPress={_submitSelection}
                style={[styles.button, { backgroundColor: submitButtonColor }]}
              >
                <Text style={[styles.buttonText, fontFamily ? { fontFamily } : {}]}>
                  {submitButtonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View>
          <View style={[styles.dropdownView, styleDropdownMenu]}>
            <View
              style={[
                styles.subSection,
                { paddingTop: 10, paddingBottom: 10 },
                styleDropdownMenuSubsection,
              ]}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  setSelector(!selector);
                  onToggleList();
                }}
              >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={[
                      {
                        flex: 1,
                        fontSize,
                        color: textColor,
                        fontFamily: altFontFamily || fontFamily,
                      },
                      !selectedItems.length ? styleTextDropdown : styleTextDropdownSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {selectedItems.length
                      ? `${selectText} (${selectedItems.length} ${selectedText})`
                      : selectText}
                  </Text>
                  <Icon
                    name={hideSubmitButton ? 'menu-right' : 'menu-down'}
                    style={[styles.indicator, styleIndicator]}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MultiSelect;
